"""
Tables endpoints for dynamic data table management
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from datetime import datetime
from app.auth import get_current_user, CurrentUser

router = APIRouter(prefix="/tables", tags=["tables"])

class ColumnInfo(BaseModel):
    name: str
    type: str
    nullable: bool

class TableData(BaseModel):
    table_name: str
    display_name: str
    schema_id: str
    row_count: int
    columns: List[ColumnInfo]
    sample_data: List[Dict[str, Any]]

class TablesResponse(BaseModel):
    status: str
    tables: List[TableData]
    count: int

@router.get("/", response_model=TablesResponse)
# TODO: current_user: CurrentUser = Depends(get_current_user), add back in for auth
async def get_all_tables():
    """
    Get all tables from all uploaded schemas with sample data
    """
    try:
        from ..database import get_connection
        
        tables_list = []
        
        # Get connection to query PostgreSQL
        conn = get_connection()
        cursor = conn.cursor()
        
        # Get all user schemas (excluding system schemas)
        cursor.execute("""
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'public')
            ORDER BY schema_name
        """)
        
        schema_names = cursor.fetchall()
        
        for (schema_name,) in schema_names:
            try:
                # Get all tables in this schema
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = %s
                    ORDER BY table_name
                """, (schema_name,))
                
                table_names = cursor.fetchall()
                
                for (table_name,) in table_names:
                    try:
                        # Get column information
                        cursor.execute("""
                            SELECT column_name, data_type, is_nullable
                            FROM information_schema.columns 
                            WHERE table_schema = %s AND table_name = %s
                            ORDER BY ordinal_position
                        """, (schema_name, table_name))
                        
                        column_info = cursor.fetchall()
                        columns = [
                            ColumnInfo(
                                name=col[0],
                                type=col[1],
                                nullable=col[2] == 'YES'
                            ) for col in column_info
                        ]
                        
                        # Get row count
                        cursor.execute(f'SELECT COUNT(*) FROM "{schema_name}"."{table_name}"')
                        row_count = cursor.fetchone()[0]
                        
                        # Get sample data (first 50 rows)
                        cursor.execute(f'SELECT * FROM "{schema_name}"."{table_name}" LIMIT 50')
                        rows = cursor.fetchall()
                        
                        # Convert rows to dictionaries
                        column_names = [col.name for col in columns]
                        sample_data = []
                        for row in rows:
                            row_dict = {}
                            for i, value in enumerate(row):
                                if i < len(column_names):
                                    # Convert values to JSON-serializable types
                                    if value is None:
                                        row_dict[column_names[i]] = None
                                    elif isinstance(value, (int, float, str, bool)):
                                        row_dict[column_names[i]] = value
                                    else:
                                        row_dict[column_names[i]] = str(value)
                            sample_data.append(row_dict)
                        
                        # Create display name (prettier version of table name)
                        display_name = table_name.replace('_data', '').replace('_', ' ').title()
                        
                        tables_list.append(TableData(
                            table_name=table_name,
                            display_name=display_name,
                            schema_id=schema_name,
                            row_count=row_count,
                            columns=columns,
                            sample_data=sample_data
                        ))
                        
                    except Exception as e:
                        print(f"Error processing table {schema_name}.{table_name}: {e}")
                        continue
                        
            except Exception as e:
                print(f"Error processing schema {schema_name}: {e}")
                continue
        
        cursor.close()
        conn.close()
        
        return TablesResponse(
            status="success",
            tables=tables_list,
            count=len(tables_list)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get tables: {str(e)}")


@router.get("/{table_name}/data")
# TODO: current_user: CurrentUser = Depends(get_current_user), add back in for auth
async def get_table_data(table_name: str, schema: str, limit: int = 50):
    """
    Get data from a specific table with optional limit
    """
    try:
        from ..database import get_connection
        
        # Get connection to query PostgreSQL
        conn = get_connection()
        cursor = conn.cursor()
        
        # Get column information first
        cursor.execute("""
            SELECT column_name, data_type
            FROM information_schema.columns 
            WHERE table_schema = %s AND table_name = %s
            ORDER BY ordinal_position
        """, (schema, table_name))
        
        column_info = cursor.fetchall()
        column_names = [col[0] for col in column_info]
        
        if not column_names:
            raise HTTPException(status_code=404, detail=f"Table {schema}.{table_name} not found")
        
        # Get data with limit
        cursor.execute(f'SELECT * FROM "{schema}"."{table_name}" LIMIT %s', (limit,))
        rows = cursor.fetchall()
        
        # Convert rows to dictionaries
        data = []
        for row in rows:
            row_dict = {}
            for i, value in enumerate(row):
                if i < len(column_names):
                    # Convert values to JSON-serializable types
                    if value is None:
                        row_dict[column_names[i]] = None
                    elif isinstance(value, (int, float, str, bool)):
                        row_dict[column_names[i]] = value
                    else:
                        row_dict[column_names[i]] = str(value)
            data.append(row_dict)
        
        cursor.close()
        conn.close()
        
        return {
            "status": "success",
            "table_name": table_name,
            "schema_name": schema,
            "data": data,
            "count": len(data),
            "columns": column_names
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get table data: {str(e)}")
