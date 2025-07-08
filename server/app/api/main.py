from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import psycopg2

from server.app.services.openai_client import OpenAIClient
from server.app.db.get_db_schema import get_db_schema
from server.app.db.connection import get_connection
from server.app.utils.utils import validate_sql_safety

app = FastAPI()

class QueryRequest(BaseModel):
    question: str

class SQLRequest(BaseModel):
    sql: str

@app.post("/generate-sql")
async def generate_sql(request: QueryRequest):
    """
    Generate SQL query from natural language question
    
    Args:
        request: QueryRequest object containing:
            question (str): Natural language question to convert to SQL
            
    Returns:
        dict containing:
            question (str): Original question
            sql_query (str): Generated SQL query
            schema (str): Database schema used for generation
            
    Raises:
        HTTPException: If there is an error generating the query
    """

    # Validate the SQL that will be generated
    validation = validate_sql_safety(request.question, include_select=True)

    if not validation["is_safe"]:
        return JSONResponse(content={"error": validation["message"]}, status_code=400)
    
    try:
        # Get database schema
        schema = get_db_schema()
        
        # Create OpenAI client
        client = OpenAIClient()
        
        # Generate SQL
        sql_query = client.generate_sql_query(request.question, schema)
        
        return {
            "data": {
                "question": request.question,
                "sql_query": sql_query,
                "schema": schema
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/run-sql")
async def run_sql(request: SQLRequest):
    """
    Execute SQL query and return results
    
    Args:
        request: SQLRequest object containing:
            sql (str): SQL query to execute
            
    Returns:
        dict containing:
            data (list): List of dictionaries with query results
            
    Raises:
        HTTPException: If SQL is unsafe or has invalid syntax
        JSONResponse: For other execution errors
    """

    # Validate the SQL that will be generated
    validation = validate_sql_safety(request.question, include_select=True)

    if not validation["is_safe"]:
        return JSONResponse(content={"error": validation["message"]}, status_code=400)

    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute(request.sql)
        print(request.sql)
        rows = cur.fetchall()
        column_names = [desc[0] for desc in cur.description]
        results = [dict(zip(column_names, row)) for row in rows]
        cur.close()
        conn.close()

        return {"data": results}

    except psycopg2.errors.SyntaxError:
        raise HTTPException(status_code=400, detail="Invalid SQL syntax.")
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 