# need to add this to remote server 
import os
import psycopg2
from .connection import get_connection


def get_db_schema(database_name: str = None) -> str:
    """Get database schema as formatted string for the specified database"""
    
    # Store original DB_NAME
    original_db_name = os.getenv("DB_NAME")
    
    try:
        # Temporarily set the database name if provided
        if database_name:
            os.environ["DB_NAME"] = database_name
        
        # Get connection to the specified database
        conn = get_connection()
        cur = conn.cursor()
        
        try:
            cur.execute("""
                SELECT table_name, column_name, data_type, is_nullable, column_default
                FROM information_schema.columns
                WHERE table_schema = 'public'
                ORDER BY table_name, ordinal_position;
            """)
            
            rows = cur.fetchall()
            
            schema_dict = {}
           
            for table, column, data_type, is_nullable, column_default in rows:
                if table not in schema_dict:
                    schema_dict[table] = []
                
                # Format column with type and constraints
                column_def = f"{column} {data_type}"
                if is_nullable == 'NO':
                    column_def += " NOT NULL"
                if column_default:
                    column_def += f" DEFAULT {column_default}"
                
                schema_dict[table].append(column_def)
            
            # Format: table_name(column1 type, column2 type)
            schema_str = "\n".join(
                f"{table}({', '.join(columns)})" for table, columns in schema_dict.items()
            )
            
            return schema_str
            
        finally:
            cur.close()
            conn.close()
            
    finally:
        # Restore original DB_NAME
        if original_db_name:
            os.environ["DB_NAME"] = original_db_name
        elif "DB_NAME" in os.environ:
            del os.environ["DB_NAME"]


def get_db_schema_for_database(database_name: str) -> str:
    """Convenience function to get schema for a specific database"""
    return get_db_schema(database_name)


if __name__ == "__main__":
    try:
        # Test with default database
        schema = get_db_schema()
        print("Default database schema:")
        print(schema)
        
        # Test with specific database
        test_db = "northwind"
        schema = get_db_schema(test_db)
        print(f"\n{test_db} database schema:")
        print(schema)
    except Exception as e:
        print(f"Error: {e}")