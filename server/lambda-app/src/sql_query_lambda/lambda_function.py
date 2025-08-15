# src/query_lambda/query.py
import os, json, base64, re
import boto3

# ---- env ----
DB_ARN         = os.environ["DB_ARN"]
DB_NAME        = os.environ["DB_NAME"]
DB_SECRET_ARN  = os.environ["DB_SECRET_ARN"]
SQL_SCHEMA     = os.environ.get("SQL_SCHEMA", "schema_sql")
CSV_SCHEMA     = os.environ.get("CSV_SCHEMA", "schema_csv")
MAX_ROWS       = int(os.environ.get("MAX_RESULT_ROWS", "200"))

rds = boto3.client("rds-data")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
}

def lambda_handler(event, _):
    # CORS preflight
    if (event.get("requestContext", {}).get("http", {}) or {}).get("method") == "OPTIONS":
        return _resp(200, {"ok": True})

    qp   = event.get("queryStringParameters") or {}
    body = _parse_body(event.get("body"), event.get("isBase64Encoded"))

    # schema selection via query param (sql/csv or explicit name)
    schema_hint = (qp.get("schema") or "").strip().lower()
    if   schema_hint in ("sql", "schema_sql"): schema = SQL_SCHEMA
    elif schema_hint in ("csv", "schema_csv"): schema = CSV_SCHEMA
    elif schema_hint:                           schema = schema_hint
    else:                                       return _resp(400, {"error": "Add ?schema=sql or ?schema=csv"})

    # sql from body
    user_sql = (body.get("sql") or "").strip()
    if not user_sql:
        return _resp(400, {"error": "Body must have JSON { \"sql\": \"SELECT ...\" }"})

    # normalize & harden
    sql = _extract_single_statement(user_sql)
    _ensure_select_only(sql)
    if not re.search(r"\blimit\b", sql, re.I):
        sql = sql.rstrip(";") + f" LIMIT {MAX_ROWS};"

    # run inside one transaction so search_path applies
    tx = _begin_tx()
    try:
        _exec(f"SET search_path TO {schema}, public", tx=tx)
        res = _exec(sql, tx=tx)  # now includes columnMetadata

        # Build rows as list of objects keyed by column names
        col_meta = res.get("columnMetadata") or []
        col_names = [(m.get("name") or f"col_{i+1}") for i, m in enumerate(col_meta)]

        rows_out = []
        for rec in (res.get("records") or []):
            item = {}
            for k, cell in zip(col_names, rec):
                item[k] = next(iter(cell.values())) if cell else None
            rows_out.append(item)

        _commit_tx(tx)
    except Exception as e:
        _rollback_tx(tx)
        return _resp(400, {"error": str(e), "schema_used": schema, "sql": sql})

    return _resp(200, {
        "schema_used": schema,
        "sql": sql,
        "rows": rows_out
    })

# ---------------- helpers ----------------
def _resp(code, body):
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(body)}

def _parse_body(b, is64):
    if not b: return {}
    if is64: b = base64.b64decode(b if isinstance(b,(bytes,bytearray)) else b.encode()).decode("utf-8","ignore")
    if isinstance(b,(bytes,bytearray)): b = b.decode("utf-8","ignore")
    try: return json.loads(b) if b else {}
    except: return {}

def _exec(sql, params=None, tx=None):
    parameters=[]
    if params:
        for k,v in params.items():
            parameters.append({"name":k,"value":{"stringValue":"" if v is None else str(v)}})
    kwargs = dict(
        resourceArn=DB_ARN,
        secretArn=DB_SECRET_ARN,
        database=DB_NAME,
        sql=sql,
        parameters=parameters,
        includeResultMetadata=True,      # <-- critical: return columnMetadata
    )
    if tx: kwargs["transactionId"] = tx
    return rds.execute_statement(**kwargs)

def _begin_tx():
    return rds.begin_transaction(resourceArn=DB_ARN, secretArn=DB_SECRET_ARN, database=DB_NAME)["transactionId"]

def _commit_tx(tx):
    rds.commit_transaction(resourceArn=DB_ARN, secretArn=DB_SECRET_ARN, transactionId=tx)

def _rollback_tx(tx):
    rds.rollback_transaction(resourceArn=DB_ARN, secretArn=DB_SECRET_ARN, transactionId=tx)

def _extract_single_statement(txt: str) -> str:
    # strip fences, keep first statement, ensure a trailing semicolon
    txt = re.sub(r"^```.*?\n|\n```$", "", txt.strip(), flags=re.S)
    first = txt.split(";")[0].strip()
    return (first + ";") if not first.endswith(";") else first

def _ensure_select_only(sql: str):
    # allow SELECT/CTE only; disallow multi-statement and any DDL/DML/txn commands
    if ";" in sql.strip()[:-1]:
        raise ValueError("Multiple statements not allowed.")
    bad = r"\b(insert|update|delete|merge|truncate|drop|alter|create|grant|revoke|comment|vacuum|analyze|begin|commit|rollback)\b"
    if re.search(bad, sql, re.I):
        raise ValueError("Only read-only SELECT is allowed.")
    if not re.match(r"^\s*(with\s|select\s)", sql, re.I):
        raise ValueError("SQL must be a SELECT.")
