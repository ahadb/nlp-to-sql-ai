# src/generate_lambda/generate.py
# Minimal: introspect schema via RDS, ask OpenAI for one SELECT, return SQL only (no execution)

import os, json, base64, re
import boto3
from openai import OpenAI

# ---- env ----
DB_ARN         = os.environ["DB_ARN"]
DB_NAME        = os.environ["DB_NAME"]
DB_SECRET_ARN  = os.environ["DB_SECRET_ARN"]
SQL_SCHEMA     = os.environ.get("SQL_SCHEMA", "schema_sql")
CSV_SCHEMA     = os.environ.get("CSV_SCHEMA", "schema_csv")
TABLE_NAME     = os.environ.get("TABLE_NAME", "data_table")
ROW_LIMIT      = int(os.environ.get("ROW_LIMIT", "100"))
OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
OPENAI_MODEL   = os.environ.get("OPENAI_MODEL", "gpt-4o-mini")

rds = boto3.client("rds-data")
oa  = OpenAI(api_key=OPENAI_API_KEY)

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

    # Inputs
    question = (qp.get("q") or body.get("question") or "").strip()
    if not question:
        return _resp(400, {"error": "Provide 'q' (query param) or 'question' (JSON)."})
    table = (qp.get("table") or body.get("table") or TABLE_NAME).strip() or TABLE_NAME

    # Schema selection with query-param override (+ verification in RDS)
    schema_hint = (qp.get("schema") or body.get("schema") or "").strip()
    try:
        schema = _resolve_schema(schema_hint, table)
    except ValueError as e:
        return _resp(404, {"error": str(e)})

    # Introspect columns from RDS (read-only)
    cols = _columns(schema, table)
    if not cols:
        return _resp(404, {"error": f"No columns found for {schema}.{table}. Does the table exist?"})

    schema_ctx = ", ".join([f'{c["name"]} {c["type"]}' for c in cols])

    # Prompt: one SELECT, Postgres, add LIMIT if missing
    sys = ("You write PostgreSQL SQL only. Output exactly ONE SELECT statement. "
           f"Use the provided table/columns. If no LIMIT present, add LIMIT {ROW_LIMIT}. "
           "No DDL/DML. No prose or markdown.")
    user = f"Table: {schema}.{table}({schema_ctx}). Question: {question}. Return one SELECT."

    # Call OpenAI
    resp = oa.chat.completions.create(
        model=OPENAI_MODEL,
        messages=[{"role":"system","content":sys},
                  {"role":"user","content":user}]
    )
    sql = (resp.choices[0].message.content or "").strip()
    sql = _extract_sql(sql)
    _validate_sql(sql)
    if not re.search(r"\blimit\b", sql, re.I):
        sql = sql.rstrip(";") + f" LIMIT {ROW_LIMIT};"

    return _resp(200, {"schema_used": schema, "table": table, "sql": sql})

# ---------- helpers ----------
def _resp(code, body):
    return {"statusCode": code, "headers": {**CORS, "Content-Type": "application/json"}, "body": json.dumps(body)}

def _parse_body(b, is64):
    if not b: return {}
    if is64: b = base64.b64decode(b if isinstance(b,(bytes,bytearray)) else b.encode()).decode("utf-8","ignore")
    if isinstance(b,(bytes,bytearray)): b = b.decode("utf-8","ignore")
    try: return json.loads(b) if b else {}
    except: return {}

def _exec(sql, params=None):
    parameters=[]
    if params:
        for k,v in params.items():
            parameters.append({"name":k,"value":{"stringValue":"" if v is None else str(v)}})
    return rds.execute_statement(
        resourceArn=DB_ARN, secretArn=DB_SECRET_ARN, database=DB_NAME, sql=sql, parameters=parameters
    )

def _exists_table(schema, table):
    r=_exec("SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=:s AND table_name=:t",
            {"s":schema,"t":table})
    return int(next(iter(r["records"][0][0].values())))>0 if r.get("records") else False

def _schema_exists(schema):
    r=_exec("SELECT COUNT(*) FROM information_schema.schemata WHERE schema_name=:s", {"s":schema})
    return int(next(iter(r["records"][0][0].values())))>0 if r.get("records") else False

def _resolve_schema(hint, table):
    """
    Priority:
      1) If query/body provided `schema`, map 'sql'->SQL_SCHEMA, 'csv'->CSV_SCHEMA, else use explicit name.
         - Verify table exists in that schema; if not, raise 404 (clear feedback).
      2) If no hint, prefer SQL_SCHEMA if table exists there; otherwise CSV_SCHEMA if it exists there.
      3) Fallback: first existing among SQL_SCHEMA/CSV_SCHEMA; else 'public'.
    """
    norm = hint.strip().lower()
    if norm:
        if norm in ("sql","schema_sql"): chosen = SQL_SCHEMA
        elif norm in ("csv","schema_csv"): chosen = CSV_SCHEMA
        else: chosen = hint  # explicit schema name
        if not _schema_exists(chosen):
            raise ValueError(f"Schema not found: {chosen}")
        if not _exists_table(chosen, table):
            raise ValueError(f"Table {table} not found in schema {chosen}")
        return chosen

    # No hint → auto-pick
    if _exists_table(SQL_SCHEMA, table): return SQL_SCHEMA
    if _exists_table(CSV_SCHEMA, table): return CSV_SCHEMA
    if _schema_exists(SQL_SCHEMA): return SQL_SCHEMA
    if _schema_exists(CSV_SCHEMA): return CSV_SCHEMA
    return "public"

def _columns(schema, table):
    r=_exec("""SELECT column_name, data_type
               FROM information_schema.columns
               WHERE table_schema=:s AND table_name=:t
               ORDER BY ordinal_position""", {"s":schema,"t":table})
    return [{"name":next(iter(row[0].values())), "type":next(iter(row[1].values()))} for row in (r.get("records") or [])]

def _extract_sql(txt):
    # strip code fences; keep first statement; ensure trailing semicolon
    txt = re.sub(r"^```.*?\n|\n```$", "", txt.strip(), flags=re.S)
    first = txt.split(";")[0].strip()
    return (first + ";") if not first.endswith(";") else first

def _validate_sql(sql):
    if re.search(r"\b(insert|update|delete|drop|alter|create|grant|revoke|begin|commit|rollback)\b", sql, re.I):
        raise ValueError("Generated SQL must be a single SELECT.")
    if not re.match(r"^\s*(with\s|select\s)", sql, re.I):
        raise ValueError("Not a SELECT.")
