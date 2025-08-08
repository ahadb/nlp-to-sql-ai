import os
import pandas as pd
import io
from fastapi import FastAPI, HTTPException, File, UploadFile, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2

from app.services.openai_client import OpenAIClient
from app.db.get_db_schema import get_db_schema
from app.db.connection import get_connection
from app.utils.utils import validate_sql_safety
from config.settings import settings

# Validate settings on startup
try:
    settings.validate()
except ValueError as e:
    print(f"Configuration error: {e}")
    exit(1)

# Separate database names for different file types
SQL_DATABASE_NAME = "sql_database"
CSV_DATABASE_NAME = "csv_database"

# In-memory storage for user database mappings (in production, use a proper database)
user_databases = {}

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    debug=settings.DEBUG
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

def process_csv_file(csv_content: str, table_name: str, conn) -> str:
    """
    Process CSV content and create a table in the database
    
    Args:
        csv_content: CSV file content as string
        table_name: Name for the table to be created
        conn: Database connection
        
    Returns:
        str: Success message
    """
    try:
        # Read CSV content
        df = pd.read_csv(io.StringIO(csv_content))
        
        # Clean column names (replace spaces with underscores, lowercase)
        df.columns = [col.lower().replace(' ', '_').replace('-', '_') for col in df.columns]
        
        # Infer data types
        dtype_mapping = {}
        for col in df.columns:
            if df[col].dtype == 'object':
                # Check if it's actually a date
                try:
                    pd.to_datetime(df[col], errors='raise')
                    dtype_mapping[col] = 'TIMESTAMP'
                except:
                    dtype_mapping[col] = 'TEXT'
            elif df[col].dtype == 'int64':
                dtype_mapping[col] = 'INTEGER'
            elif df[col].dtype == 'float64':
                dtype_mapping[col] = 'REAL'
            else:
                dtype_mapping[col] = 'TEXT'
        
        # Generate CREATE TABLE statement
        columns = []
        for col, dtype in dtype_mapping.items():
            columns.append(f'"{col}" {dtype}')
        
        create_table_sql = f"""
        CREATE TABLE IF NOT EXISTS "{table_name}" (
            {', '.join(columns)}
        );
        """
        
        # Execute CREATE TABLE
        cur = conn.cursor()
        cur.execute(create_table_sql)
        
        # Check if table already has data
        cur.execute(f'SELECT COUNT(*) FROM "{table_name}"')
        existing_rows = cur.fetchone()[0]
        
        if existing_rows > 0:
            # Table already has data, truncate it first
            cur.execute(f'TRUNCATE TABLE "{table_name}"')
            print(f"Truncated existing table '{table_name}' with {existing_rows} rows")
        
        # Insert data
        for _, row in df.iterrows():
            placeholders = ', '.join(['%s'] * len(row))
            insert_sql = f'INSERT INTO "{table_name}" VALUES ({placeholders})'
            cur.execute(insert_sql, row.values.tolist())
        
        conn.commit()
        cur.close()
        
        return f"CSV data uploaded successfully. {'Replaced' if existing_rows > 0 else 'Created'} table '{table_name}' with {len(df)} rows."
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"CSV processing failed: {str(e)}")

@app.get("/health-check")
async def health_check():
    return {"status": "healthy"}

@app.post("/upload-schema")
async def upload_schema(
    file: UploadFile = File(...),
    database: str = Query(default="auto")
):
    # Determine database based on file type
    print(file, database)
    file_type = "csv" if file.filename.endswith(".csv") else "sql"
    database = CSV_DATABASE_NAME if file_type == "csv" else SQL_DATABASE_NAME

    # Check file type
    if not (file.filename.endswith(".sql") or file.filename.endswith(".csv")):
        raise HTTPException(status_code=400, detail="Only .sql and .csv files are supported.")
    
    file_type = "csv" if file.filename.endswith(".csv") else "sql"

    # Read file contents
    contents = await file.read()
    file_content = contents.decode("utf-8")

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

        # Now connect to the target database
        conn = get_connection_to_db(database)
        
        if file_type == "sql":
            # Handle SQL file
            # Optional: block dangerous keywords
            forbidden_keywords = ["drop database", "create database"]
            if any(word in file_content.lower() for word in forbidden_keywords):
                raise HTTPException(status_code=400, detail="SQL script contains forbidden commands.")
            
            # Execute the schema SQL
            cur = conn.cursor()
            cur.execute(file_content)
            conn.commit()
            cur.close()
            
            message = f"SQL schema and data uploaded successfully to database '{database}'."
        else:
            # Handle CSV file
            table_name = file.filename.replace(".csv", "").lower()
            message = process_csv_file(file_content, table_name, conn)
        
        conn.close()
        
        # Store the database mapping for this session
        # In a real app, you'd associate this with a user session
        user_databases["current"] = database
        user_databases["file_type"] = file_type
        
        return {"message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File processing failed: {str(e)}")

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
        
        print(f"Generating SQL for database: {current_database}")
        
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
        
        print(f"Executing SQL on database: {current_database}")
        print(f"SQL Query: {request.sql}")
        
        # Connect to the user's database
        conn = get_connection_to_db(current_database)
        cur = conn.cursor()
        cur.execute(request.sql)
        print(f"SQL executed successfully on {current_database}")
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

@app.get("/current-database")
async def get_current_database():
    """Get the current database that the user uploaded to"""
    current_database = user_databases.get("current")
    file_type = user_databases.get("file_type")
    if not current_database:
        raise HTTPException(status_code=404, detail="No database uploaded yet")
    
    return {
        "database": current_database,
        "file_type": file_type,
        "available_databases": {
            "sql": SQL_DATABASE_NAME,
            "csv": CSV_DATABASE_NAME
        }
    }

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

@app.get("/debug/tables")
async def debug_tables():
    """Debug endpoint to see all tables in the current database"""
    current_database = user_databases.get("current")
    if not current_database:
        raise HTTPException(status_code=404, detail="No database uploaded yet")
    
    try:
        conn = get_connection_to_db(current_database)
        cur = conn.cursor()
        
        # Get all tables in the database
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        """)
        
        tables = [row[0] for row in cur.fetchall()]
        cur.close()
        conn.close()
        
        return {
            "database": current_database,
            "tables": tables,
            "table_count": len(tables)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get tables: {str(e)}")

@app.get("/debug/schema-details")
async def debug_schema_details():
    """Debug endpoint to see detailed schema information"""
    current_database = user_databases.get("current")
    if not current_database:
        raise HTTPException(status_code=404, detail="No database uploaded yet")
    
    try:
        conn = get_connection_to_db(current_database)
        cur = conn.cursor()
        
        # Get detailed schema information
        cur.execute("""
            SELECT 
                table_name,
                column_name,
                data_type,
                is_nullable,
                column_default
            FROM information_schema.columns
            WHERE table_schema = 'public'
            ORDER BY table_name, ordinal_position;
        """)
        
        rows = cur.fetchall()
        schema_details = {}
        
        for table, column, data_type, is_nullable, column_default in rows:
            if table not in schema_details:
                schema_details[table] = []
            
            column_info = {
                "column": column,
                "type": data_type,
                "nullable": is_nullable == "YES",
                "default": column_default
            }
            schema_details[table].append(column_info)
        
        cur.close()
        conn.close()
        
        return {
            "database": current_database,
            "schema_details": schema_details
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get schema details: {str(e)}")

@app.post("/select-database")
async def select_database(database_type: str):
    """Select which database to query (sql or csv)"""
    if database_type not in ["sql", "csv"]:
        raise HTTPException(status_code=400, detail="Database type must be 'sql' or 'csv'")
    
    database_name = SQL_DATABASE_NAME if database_type == "sql" else CSV_DATABASE_NAME
    
    # Check if database exists
    try:
        conn = get_connection_to_db("postgres")
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(f"SELECT 1 FROM pg_database WHERE datname = '{database_name}'")
        exists = cur.fetchone() is not None
        cur.close()
        conn.close()
        
        if not exists:
            raise HTTPException(status_code=404, detail=f"Database '{database_name}' does not exist. Please upload a {database_type} file first.")
        
        # Update current database
        user_databases["current"] = database_name
        user_databases["file_type"] = database_type
        
        return {
            "message": f"Switched to {database_type} database",
            "database": database_name,
            "file_type": database_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to select database: {str(e)}") 