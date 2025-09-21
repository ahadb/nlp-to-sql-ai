"""
Upload endpoints for file processing and schema management
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from ..services.schema_service import SchemaService, SchemaType

router = APIRouter(prefix="/upload", tags=["upload"])

# Initialize schema service
schema_service = SchemaService()

class UploadRequest(BaseModel):
    file_name: str
    file_content: str
    schema_type: str  # "SQL_SCHEMA" or "CSV_FILE"
    description: Optional[str] = None

class UploadResponse(BaseModel):
    status: str
    message: str
    schema_id: str
    schema_type: str
    table_count: int
    ai_context_ready: bool

@router.post("/", response_model=UploadResponse)
async def upload_file(request: UploadRequest):
    """
    Upload and process SQL or CSV files
    """
    try:
        # Convert string to proper SchemaType enum
        if request.schema_type.upper() == "SQL_SCHEMA":
            schema_type = SchemaType.SQL_SCHEMA
        elif request.schema_type.upper() == "CSV_FILE":
            schema_type = SchemaType.CSV_FILE
        else:
            raise HTTPException(status_code=400, detail="Invalid schema_type. Use 'SQL_SCHEMA' or 'CSV_FILE'")
        
        # Process the file with proper enum
        schema = await schema_service.process_file_upload(
            file_name=request.file_name,
            file_content=request.file_content,
            schema_type=schema_type,
            description=request.description
        )
        
        # Generate AI context to test cross-schema functionality
        ai_context = schema_service.generate_schema_context_for_ai([schema.schema_id])
        
        return UploadResponse(
            status="success",
            message=f"Successfully processed {request.file_name}",
            schema_id=schema.schema_id,
            schema_type=schema.schema_type.value,
            table_count=len(schema.tables),
            ai_context_ready=len(ai_context) > 0
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload processing failed: {str(e)}")

class SchemaDetails(BaseModel):
    schema_id: str
    file_name: str
    type: str
    table_count: int
    row_count: int
    size: str
    status: str
    last_updated: str

@router.get("/schemas")
async def list_schemas():
    """
    List all uploaded schemas with detailed information
    """
    try:
        from ..database import get_connection
        import psycopg
        from datetime import datetime
        
        schemas_list = []
        
        # Get connection to query PostgreSQL system tables
        conn = get_connection()
        cursor = conn.cursor()
        
        # Query for all schemas excluding system schemas
        cursor.execute("""
            SELECT schema_name 
            FROM information_schema.schemata 
            WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'public')
            ORDER BY schema_name
        """)
        
        schema_names = cursor.fetchall()
        
        for (schema_name,) in schema_names:
            try:
                # Extract file name from schema name
                # Schema names are cleaned file names (products, sales_data, etc.)
                display_name = schema_name
                
                # Determine type by checking if schema has typical CSV table pattern
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = %s
                    LIMIT 1
                """, (schema_name,))
                first_table = cursor.fetchone()
                
                if first_table and first_table[0].endswith('_data'):
                    file_type = "CSV"
                    display_name = f"{schema_name}.csv"
                else:
                    file_type = "SQL"
                    display_name = f"{schema_name}.sql"
                
                # Count tables in this schema
                cursor.execute("""
                    SELECT COUNT(*) 
                    FROM information_schema.tables 
                    WHERE table_schema = %s
                """, (schema_name,))
                table_count = cursor.fetchone()[0]
                
                # Count total rows across all tables in schema
                total_rows = 0
                cursor.execute("""
                    SELECT table_name 
                    FROM information_schema.tables 
                    WHERE table_schema = %s
                """, (schema_name,))
                tables = cursor.fetchall()
                
                for (table_name,) in tables:
                    try:
                        cursor.execute(f'SELECT COUNT(*) FROM "{schema_name}"."{table_name}"')
                        row_count = cursor.fetchone()[0]
                        total_rows += row_count
                    except:
                        # Skip if table has issues
                        continue
                
                # Estimate size (rough calculation)
                estimated_size = total_rows * 100  # ~100 bytes per row estimate
                if estimated_size < 1024:
                    size_display = f"{estimated_size} B"
                elif estimated_size < 1024 * 1024:
                    size_display = f"{estimated_size / 1024:.1f} KB"
                else:
                    size_display = f"{estimated_size / (1024 * 1024):.1f} MB"
                
                # Status based on whether tables have data
                status = "Active" if total_rows > 0 else "Empty"
                
                schemas_list.append(SchemaDetails(
                    schema_id=schema_name,
                    file_name=display_name,
                    type=file_type,
                    table_count=table_count,
                    row_count=total_rows,
                    size=size_display,
                    status=status,
                    last_updated=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                ))
                
            except Exception as e:
                # Skip problematic schemas but log the error
                print(f"Error processing schema {schema_name}: {e}")
                continue
        
        cursor.close()
        conn.close()
        
        return {
            "status": "success",
            "schemas": schemas_list,
            "count": len(schemas_list)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list schemas: {str(e)}")

@router.delete("/schemas/{schema_id}")
async def delete_schema(schema_id: str):
    """
    Delete a schema and its tables
    """
    try:
        success = await schema_service.drop_schema_tables(schema_id)
        
        if success:
            await schema_service.delete_schema(schema_id)
            return {
                "status": "success",
                "message": f"Schema {schema_id} deleted successfully",
                "schema_id": schema_id
            }
        else:
            return {
                "status": "warning", 
                "message": f"Schema {schema_id} not found or already deleted",
                "schema_id": schema_id
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete schema: {str(e)}")
