# upload.py — /upload Lambda using Aurora RDS Data API (no psycopg2, no VPC)
import os, json, uuid, base64, re
from io import BytesIO

import boto3
import pandas as pd
from requests_toolbelt.multipart import decoder

# ---- env ----
S3_BUCKET     = os.environ["S3_BUCKET"]
DB_ARN        = os.environ["DB_ARN"]          # cluster ARN
DB_NAME       = os.environ["DB_NAME"]         # e.g., appdb (or postgres)
DB_SECRET_ARN = os.environ["DB_SECRET_ARN"]   # Secrets Manager secret ARN

CSV_SCHEMA    = os.environ.get("CSV_SCHEMA", "schema_csv")
SQL_SCHEMA    = os.environ.get("SQL_SCHEMA", "schema_sql")
TABLE_NAME    = os.environ.get("TABLE_NAME", "data_table")
MAX_BYTES     = int(os.environ.get("MAX_UPLOAD_BYTES", str(25 * 1024 * 1024)))

# ---- clients ----
s3  = boto3.client("s3")
rds = boto3.client("rds-data")

# ---- CORS ----
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def lambda_handler(event, context):
    try:
        # CORS preflight
        if (event.get("requestContext", {}).get("http", {}) or {}).get("method") == "OPTIONS":
            return _resp(200, {"ok": True})

        # Validate content-type
        headers = event.get("headers") or {}
        content_type = headers.get("content-type") or headers.get("Content-Type")
        if isinstance(content_type, (bytes, bytearray)):
            content_type = content_type.decode("utf-8", "ignore")
        if not content_type or "multipart/form-data" not in content_type.lower():
            return _resp(400, {"error": "Content-Type must be multipart/form-data with 'file'."})

        # Decode body
        body = event.get("body", b"")
        if event.get("isBase64Encoded"):
            if isinstance(body, str):
                body = body.encode("utf-8")
            body = base64.b64decode(body)
        elif isinstance(body, str):
            body = body.encode("utf-8")

        # Parse multipart and find 'file'
        mp = decoder.MultipartDecoder(body, content_type)
        file_part = None
        for part in mp.parts:
            disp = (part.headers.get(b"Content-Disposition", b"") or b"").decode("utf-8", "ignore").lower()
            if 'name="file"' in disp:
                file_part = part
                break
        if not file_part:
            return _resp(400, {"error": "Missing form field 'file'."})

        filename = _get_filename(file_part.headers.get(b"Content-Disposition", b""))
        file_bytes = file_part.content
        if len(file_bytes) > MAX_BYTES:
            return _resp(413, {"error": f"File too large. Max {MAX_BYTES} bytes."})

        ext = os.path.splitext(filename)[1].lower()
        schema_name = CSV_SCHEMA if ext == ".csv" else SQL_SCHEMA if ext == ".sql" else None
        if not schema_name:
            return _resp(400, {"error": "Only .csv or .sql files are supported."})

        # IDs/paths
        upload_id = uuid.uuid4()
        upload_id_str = str(upload_id)  # use string for S3 + JSON; SQL casts to uuid
        s3_key = f"{schema_name}/{upload_id_str}_{filename}"

        # 1) Upload raw to S3
        s3.put_object(Bucket=S3_BUCKET, Key=s3_key, Body=file_bytes)

        # 2) Ensure schemas + metadata table
        _ensure_base_objects()

        # 3) Load data
        if ext == ".csv":
            df = pd.read_csv(BytesIO(file_bytes))
            if df.shape[1] == 0:
                return _resp(400, {"error": "CSV appears to have no columns."})

            cols = _sanitize_columns(list(df.columns))
            df.columns = cols

            # recreate table
            _exec_sql(f"DROP TABLE IF EXISTS {schema_name}.{TABLE_NAME} CASCADE;")
            col_defs = ", ".join([f"\"{c}\" TEXT" for c in cols])
            _exec_sql(f"CREATE TABLE {schema_name}.{TABLE_NAME} ({col_defs});")

            # batch insert via Data API (no COPY)
            _insert_df(schema_name, TABLE_NAME, df)

        else:
            # SQL script: run inside a single Data API transaction so search_path persists
            sql_text = file_bytes.decode("utf-8", "ignore")

            tx = _begin_tx()
            try:
                # make unqualified names land in desired schema for the whole script
                _exec_sql(f"SET search_path TO {schema_name};", tx=tx)

                for stmt in _split_sql_statements(sql_text):
                    s = stmt.strip()
                    if not s:
                        continue
                    up = s.upper().rstrip(";")
                    # Data API manages tx via API — skip SQL txn control statements
                    if up in ("BEGIN", "COMMIT", "ROLLBACK"):
                        continue
                    _exec_sql(s, tx=tx)

                _commit_tx(tx)
            except Exception:
                _rollback_tx(tx)
                raise

        # 4) Write metadata  ← NOTE the uuid cast here (:id::uuid)
        _exec_sql(
            "INSERT INTO public.uploads(upload_id, file_type, schema_name, table_name, s3_key) "
            "VALUES (:id::uuid, :ft, :sn, :tn, :key)",
            params={
                "id": upload_id_str,
                "ft": ext.lstrip("."),
                "sn": schema_name,
                "tn": TABLE_NAME,
                "key": s3_key,
            }
        )

        return _resp(200, {
            "message": "Upload successful",
            "upload_id": upload_id_str,  # return string for JSON
            "schema": schema_name,
            "table": TABLE_NAME,
            "s3_key": s3_key
        })

    except Exception as e:
        return _resp(500, {"error": str(e)})

# ---------------- helpers ----------------

def _ensure_base_objects():
    _exec_sql(f"CREATE SCHEMA IF NOT EXISTS {CSV_SCHEMA};")
    _exec_sql(f"CREATE SCHEMA IF NOT EXISTS {SQL_SCHEMA};")
    _exec_sql("""
        CREATE TABLE IF NOT EXISTS public.uploads(
          upload_id   UUID PRIMARY KEY,
          file_type   TEXT NOT NULL,
          schema_name TEXT NOT NULL,
          table_name  TEXT NOT NULL,
          s3_key      TEXT NOT NULL,
          created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

def _rds_string_value(v):
    # send strings for our TEXT columns; empty string for None
    return {"stringValue": "" if v is None else str(v)}

def _exec_sql(sql: str, params: dict | None = None, tx: str | None = None):
    parameters = []
    if params:
        for k, v in params.items():
            parameters.append({"name": k, "value": _rds_string_value(v)})

    # Build kwargs and only include transactionId if provided
    kwargs = dict(
        resourceArn=DB_ARN,
        secretArn=DB_SECRET_ARN,
        database=DB_NAME,
        sql=sql,
        parameters=parameters
    )
    if tx is not None:
        kwargs["transactionId"] = tx

    return rds.execute_statement(**kwargs)

def _begin_tx():
    resp = rds.begin_transaction(
        resourceArn=DB_ARN,
        secretArn=DB_SECRET_ARN,
        database=DB_NAME,
    )
    return resp["transactionId"]

def _commit_tx(tx_id: str):
    rds.commit_transaction(
        resourceArn=DB_ARN,
        secretArn=DB_SECRET_ARN,
        transactionId=tx_id,
    )

def _rollback_tx(tx_id: str):
    rds.rollback_transaction(
        resourceArn=DB_ARN,
        secretArn=DB_SECRET_ARN,
        transactionId=tx_id,
    )

def _insert_df(schema: str, table: str, df, rows_per_batch: int = 200):
    # keep Data API payload under ~1 MB by batching rows
    cols = list(df.columns)
    for i in range(0, len(df), rows_per_batch):
        chunk = df.iloc[i:i+rows_per_batch]
        values_sql = []
        parameters = []
        p = 0
        for row in chunk.itertuples(index=False, name=None):
            placeholders = []
            for v in row:
                name = f"p{p}"; p += 1
                placeholders.append(f":{name}")
                parameters.append({"name": name, "value": _rds_string_value(v)})
            values_sql.append(f"({', '.join(placeholders)})")
        qcols = ", ".join([f"\"{c}\"" for c in cols])
        sql = f"INSERT INTO {schema}.{table} ({qcols}) VALUES {', '.join(values_sql)}"
        rds.execute_statement(
            resourceArn=DB_ARN,
            secretArn=DB_SECRET_ARN,
            database=DB_NAME,
            sql=sql,
            parameters=parameters
        )

def _split_sql_statements(script: str):
    # split on ';' outside of quotes
    buff, in_s, q = [], False, None
    for ch in script:
        if ch in ("'", '"'):
            if not in_s:
                in_s, q = True, ch
            elif q == ch:
                in_s, q = False, None
        if ch == ";" and not in_s:
            stmt = "".join(buff).strip()
            if stmt:
                yield stmt
            buff = []
        else:
            buff.append(ch)
    tail = "".join(buff).strip()
    if tail:
        yield tail

def _get_filename(content_disposition: bytes) -> str:
    disp = (content_disposition or b"").decode("utf-8", "ignore")
    for part in disp.split(";"):
        part = part.strip()
        if part.lower().startswith("filename="):
            return part.split("=", 1)[1].strip().strip('"')
    return "uploaded_file"

def _sanitize_columns(raw_cols):
    safe_cols, seen = [], set()
    for col in raw_cols:
        c = re.sub(r"\W+", "_", str(col).strip().lower()) or "col"
        base, i = c, 1
        while c in seen:
            i += 1
            c = f"{base}_{i}"
        seen.add(c)
        safe_cols.append(c)
    return safe_cols

def _resp(code: int, body: dict):
    return {
        "statusCode": code,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps(body)
    }