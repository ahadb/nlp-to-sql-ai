"""
Database connection and utilities for QuantumSQL
"""
import psycopg
from app.config import settings

async def test_connection() -> bool:
    """Test database connection"""
    try:
        conn = psycopg.connect(settings.database_url)
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
            result = cur.fetchone()
        conn.close()
        return result is not None
    except Exception as e:
        print(f"Database connection failed: {e}")
        return False

def get_connection():
    """Get database connection"""
    return psycopg.connect(settings.database_url)

def get_db_connection():
    """Get database connection (alias for compatibility)"""
    return get_connection()

def execute_query(sql: str, params=None):
    """Execute a SQL query and return results"""
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            cur.execute(sql, params)
            if sql.strip().upper().startswith('SELECT'):
                columns = [desc[0] for desc in cur.description]
                rows = cur.fetchall()
                return [dict(zip(columns, row)) for row in rows]
            else:
                conn.commit()
                return {"status": "success"}
    finally:
        conn.close()

def create_table_from_csv(table_name: str, df, conn):
    """Create table from pandas DataFrame"""
    # Generate CREATE TABLE statement
    columns = []
    for col, dtype in df.dtypes.items():
        if dtype == 'object':
            sql_type = 'TEXT'
        elif dtype == 'int64':
            sql_type = 'INTEGER'
        elif dtype == 'float64':
            sql_type = 'REAL'
        else:
            sql_type = 'TEXT'
        columns.append(f'"{col}" {sql_type}')
    
    create_sql = f"""
    CREATE TABLE IF NOT EXISTS "{table_name}" (
        {', '.join(columns)}
    );
    """
    
    with conn.cursor() as cur:
        cur.execute(create_sql)
        conn.commit()
        
        # Insert data
        for _, row in df.iterrows():
            placeholders = ', '.join(['%s'] * len(row))
            insert_sql = f'INSERT INTO "{table_name}" VALUES ({placeholders})'
            cur.execute(insert_sql, row.values.tolist())
        
        conn.commit()
    
    return f"Created table '{table_name}' with {len(df)} rows"
