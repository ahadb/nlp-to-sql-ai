"""
Upload endpoints for file processing and schema management
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import time
from app.auth import get_current_user, CurrentUser

from ..services.schema_service import SchemaService, SchemaType
from ..services.upload_history_service import upload_history_service

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
# TODO: current_user: CurrentUser = Depends(get_current_user)
async def upload_file(request: UploadRequest):
    """
    Upload and process SQL or CSV files
    """
    start_time = time.time()
    upload_id = None
    
    try:
        # Convert string to proper SchemaType enum
        if request.schema_type.upper() == "SQL_SCHEMA":
            schema_type = SchemaType.SQL_SCHEMA
        elif request.schema_type.upper() == "CSV_FILE":
            schema_type = SchemaType.CSV_FILE
        else:
            raise HTTPException(status_code=400, detail="Invalid schema_type. Use 'SQL_SCHEMA' or 'CSV_FILE'")
        
        # Log upload start
        file_size = len(request.file_content.encode('utf-8'))
        upload_id = await upload_history_service.log_upload_start(
            file_name=request.file_name,
            file_size=file_size,
            file_type=request.schema_type
        )
        
        # Process the file with proper enum
        schema = await schema_service.process_file_upload(
            file_name=request.file_name,
            file_content=request.file_content,
            schema_type=schema_type,
            description=request.description
        )
        
        # Generate AI context to test cross-schema functionality
        ai_context = schema_service.generate_schema_context_for_ai([schema.schema_id])
        
        # Log successful upload
        processing_time = int((time.time() - start_time) * 1000)
        if upload_id:
            # Get record count from schema - use a simple count for now
            total_records = len(schema.tables) if schema.tables else 0
            await upload_history_service.log_upload_success(
                upload_id=upload_id,
                schema_id=schema.schema_id,
                records_processed=total_records,
                processing_time_ms=processing_time
            )
        
        return UploadResponse(
            status="success",
            message=f"Successfully processed {request.file_name}",
            schema_id=schema.schema_id,
            schema_type=schema.schema_type.value,
            table_count=len(schema.tables),
            ai_context_ready=len(ai_context) > 0
        )
        
    except Exception as e:
        # Log failed upload
        processing_time = int((time.time() - start_time) * 1000)
        if upload_id:
            await upload_history_service.log_upload_error(
                upload_id=upload_id,
                error_message=str(e),
                processing_time_ms=processing_time
            )
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
# TODO: current_user: CurrentUser = Depends(get_current_user), add back in for auth
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
async def delete_schema(schema_id: str, current_user: CurrentUser = Depends(get_current_user)):
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

@router.get("/history")
async def get_upload_history(current_user: CurrentUser = Depends(get_current_user)):
    """
    Get upload history for the current user
    """
    try:
        history = await upload_history_service.get_upload_history(limit=50)
        
        return {
            "status": "success",
            "history": history,
            "count": len(history)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get upload history: {str(e)}")

@router.post("/sample-data")
async def load_sample_data():
    """
    Load sample data files for demo purposes
    """
    try:
        import os
        from pathlib import Path
        
        # Get the project root directory (go up from server/app/routers)
        project_root = Path(__file__).parent.parent.parent.parent
        docs_dir = project_root / "docs"
        
        # Sample files to load
        sample_files = [
            "billing-precise-test.csv",
            "sales-precise-test.csv", 
            "support-precise-test.csv"
        ]
        
        uploaded_schemas = []
        
        for file_name in sample_files:
            file_path = docs_dir / file_name
            
            if not file_path.exists():
                print(f"Sample file not found: {file_path}")
                continue
                
            # Read file content
            with open(file_path, 'r', encoding='utf-8') as f:
                file_content = f.read()
            
            # Determine schema type
            schema_type = "CSV_FILE" if file_name.endswith('.csv') else "SQL_SCHEMA"
            
            # Create upload request
            upload_request = UploadRequest(
                file_name=file_name,
                file_content=file_content,
                schema_type=schema_type,
                description=f"Sample {file_name} for demo"
            )
            
            # Process the file
            schema = await schema_service.process_file_upload(
                file_name=upload_request.file_name,
                file_content=upload_request.file_content,
                schema_type=SchemaType.CSV_FILE if schema_type == "CSV_FILE" else SchemaType.SQL_SCHEMA,
                description=upload_request.description
            )
            
            uploaded_schemas.append({
                "file_name": file_name,
                "schema_id": schema.schema_id,
                "table_count": len(schema.tables)
            })
        
        return {
            "status": "success",
            "message": f"Successfully loaded {len(uploaded_schemas)} sample files",
            "schemas": uploaded_schemas
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load sample data: {str(e)}")
