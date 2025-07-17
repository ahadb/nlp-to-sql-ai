from fastapi import FastAPI, HTTPException, File, UploadFile, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import os

from app.services.openai_client import OpenAIClient
from app.db.get_db_schema import get_db_schema
from app.db.connection import get_connection
from app.utils.utils import validate_sql_safety

# In-memory storage for user database mappings (in production, use a proper database)
user_databases = {}

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class QueryRequest(BaseModel):
    question: str

class SQLRequest(BaseModel):
    sql: str

def get_connection_to_db(database_name: str):
    try:
        # Override DB_NAME env var temporarily
        os.environ["DB_NAME"] = database_name
        conn = get_connection()
        return conn
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

@app.post("/upload-schema")
async def upload_schema(
    file: UploadFile = File(..., content_type="text/x-sql"),
    database: str = Query(...)
):
    # Validate database name (basic protection)

    print(file, database)
    if not database.isidentifier():
        raise HTTPException(status_code=400, detail="Invalid database name.")

    if not file.filename.endswith(".sql"):
        raise HTTPException(status_code=400, detail="Only .sql files are supported.")

    # Read and decode the SQL file
    contents = await file.read()
    sql_script = contents.decode("utf-8")

    # Optional: block dangerous keywords
    forbidden_keywords = ["drop database", "create database"]
    if any(word in sql_script.lower() for word in forbidden_keywords):
        raise HTTPException(status_code=400, detail="SQL script contains forbidden commands.")

    # Create database if it doesn't exist
    try:
        # Connect to postgres to create database
        conn = get_connection_to_db("postgres")
        conn.autocommit = True
        cur = conn.cursor()
        
        # Check if database exists
        cur.execute(f"SELECT 1 FROM pg_database WHERE datname = '{database}'")
        if cur.fetchone() is None:
            cur.execute(f"CREATE DATABASE {database}")
        
        cur.close()
        conn.close()

        # Now connect to the target database and execute the schema SQL
        conn = get_connection_to_db(database)
        cur = conn.cursor()
        cur.execute(sql_script)
        conn.commit()
        cur.close()
        conn.close()
        
        # Store the database mapping for this session
        # In a real app, you'd associate this with a user session
        user_databases["current"] = database
        
        return {"message": f"Schema and data uploaded successfully to database '{database}'."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SQL execution failed: {str(e)}")

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
        # Get the database that the user uploaded to
        current_database = user_databases.get("current")
        if not current_database:
            raise HTTPException(status_code=400, detail="No database schema uploaded. Please upload a SQL file first.")
        
        # Get database schema for the user's database
        schema = get_db_schema(current_database)
        
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

    # Validate the SQL that will be executed
    validation = validate_sql_safety(request.sql)

    if not validation["is_safe"]:
        return JSONResponse(content={"error": validation["message"]}, status_code=400)

    try:
        # Get the database that the user uploaded to
        current_database = user_databases.get("current")
        if not current_database:
            raise HTTPException(status_code=400, detail="No database schema uploaded. Please upload a SQL file first.")
        
        # Connect to the user's database
        conn = get_connection_to_db(current_database)
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

@app.get("/current-database")
async def get_current_database():
    """Get the current database that the user uploaded to"""
    current_database = user_databases.get("current")
    if not current_database:
        raise HTTPException(status_code=404, detail="No database uploaded yet")
    
    return {"database": current_database}

@app.get("/schema")
async def get_schema():
    """Get the current database schema"""
    current_database = user_databases.get("current")
    if not current_database:
        raise HTTPException(status_code=404, detail="No database uploaded yet")
    
    try:
        schema = get_db_schema(current_database)
        return {"database": current_database, "schema": schema}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get schema: {str(e)}") 