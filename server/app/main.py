"""
QuantumSQL Backend - Clean FastAPI Application
Entry point for the NLP-to-SQL platform
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.config import settings
from app.database import test_connection, execute_query
import logging
# from app.services.openai_service import openai_service
from app.services.schema_service import schema_service, SchemaType
from app.services.upload_history_service import upload_history_service
from app.routers import upload, tables, auth, dashboard, reports, connections, insights, chat, data
import time

# Create FastAPI app
app = FastAPI(
    title="QuantumSQL API",
    description="AI-powered Natural Language to SQL platform",
    version="2.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(upload.router)
app.include_router(tables.router)
app.include_router(reports.router)
app.include_router(connections.router)
app.include_router(insights.router)
app.include_router(chat.router)
app.include_router(data.router)

# Test request models
class TestNLPRequest(BaseModel):
    natural_query: str
    include_explanation: bool = True

class TestSchemaRequest(BaseModel):
    file_name: str
    file_content: str
    schema_type: str  # "SQL_SCHEMA" or "CSV_FILE"
    description: str = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "QuantumSQL API is running",
        "version": "2.0.0",
        "status": "healthy",
        "database": settings.DB_NAME
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    db_status = await test_connection()
    
    return {
        "status": "healthy" if db_status else "unhealthy",
        "database": "connected" if db_status else "disconnected",
        "version": "2.0.0",
        "environment": settings.ENVIRONMENT
    }

@app.get("/test-db")
async def test_database():
    """Test database connection endpoint"""
    try:
        # Test with a simple query
        result = execute_query("SELECT version();")
        
        return {
            "status": "success",
            "message": "Database connection working",
            "postgresql_version": result[0]["version"] if result else "unknown"
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Database test failed: {str(e)}"
        }

@app.post("/test-nlp")
async def test_nlp_to_sql(request: TestNLPRequest):
    """Test endpoint for NLP-to-SQL conversion with sample schema"""
    
    # Sample e-commerce schema for testing
    sample_schema = """
    CREATE TABLE customers (
        customer_id SERIAL PRIMARY KEY,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        email VARCHAR(100),
        phone VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE products (
        product_id SERIAL PRIMARY KEY,
        product_name VARCHAR(100),
        category VARCHAR(50),
        price DECIMAL(10,2),
        stock_quantity INTEGER
    );

    CREATE TABLE orders (
        order_id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(customer_id),
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_amount DECIMAL(10,2),
        status VARCHAR(20)
    );

    CREATE TABLE order_items (
        order_item_id SERIAL PRIMARY KEY,
        order_id INTEGER REFERENCES orders(order_id),
        product_id INTEGER REFERENCES products(product_id),
        quantity INTEGER,
        unit_price DECIMAL(10,2)
    );
    """
    
    try:
        sql_query, explanation, confidence = await openai_service.generate_sql_from_natural_language(
            natural_query=request.natural_query,
            schema_context=sample_schema,
            include_explanation=request.include_explanation
        )
        
        return {
            "status": "success",
            "natural_query": request.natural_query,
            "generated_sql": sql_query,
            "explanation": explanation,
            "confidence_score": confidence,
            "schema_used": "sample_ecommerce"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"NLP-to-SQL conversion failed: {str(e)}")

@app.post("/test-schema")
async def test_schema_processing(request: TestSchemaRequest):
    """Test endpoint for schema processing (SQL and CSV)"""
    
    start_time = time.time()
    upload_id = None
    
    try:
        # Convert string to enum
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
        
        # Process the file
        schema = await schema_service.process_file_upload(
            file_name=request.file_name,
            file_content=request.file_content,
            schema_type=schema_type,
            description=request.description
        )
        
        # Generate AI context to test cross-schema functionality
        ai_context = schema_service.generate_schema_context_for_ai([schema.schema_id])
        
        return {
            "status": "success",
            "message": "Schema processed successfully",
            "schema": {
                "schema_id": schema.schema_id,
                "schema_type": schema.schema_type.value,
                "namespace": schema.namespace,
                "file_name": schema.file_name,
                "tables_count": len(schema.tables),
                "relationships_count": len(schema.relationships),
                "tables": [
                    {
                        "name": table.name,
                        "columns_count": len(table.columns),
                        "columns": [
                            {
                                "name": col.name,
                                "data_type": col.data_type,
                                "is_primary_key": col.is_primary_key,
                                "is_foreign_key": col.is_foreign_key,
                                "foreign_key_reference": col.foreign_key_reference
                            } for col in table.columns
                        ],
                        "primary_keys": table.primary_keys,
                        "foreign_keys": table.foreign_keys
                    } for table in schema.tables
                ],
                "relationships": [
                    {
                        "from": f"{rel.from_table}.{rel.from_column}",
                        "to": f"{rel.to_table}.{rel.to_column}",
                        "type": rel.relationship_type
                    } for rel in schema.relationships
                ]
            },
            "ai_context_preview": ai_context
        }
        
        # Log successful upload
        processing_time = int((time.time() - start_time) * 1000)
        if upload_id:
            # Get record count from schema tables
            total_records = sum(len(table.sample_data) for table in schema.tables) if schema.tables else 0
            await upload_history_service.log_upload_success(
                upload_id=upload_id,
                schema_id=schema.schema_id,
                records_processed=total_records,
                processing_time_ms=processing_time
            )
        
        return {
            "status": "success",
            "message": "Schema processed successfully",
            "schema": {
                "schema_id": schema.schema_id,
                "schema_type": schema.schema_type.value,
                "namespace": schema.namespace,
                "file_name": schema.file_name,
                "tables_count": len(schema.tables),
                "relationships_count": len(schema.relationships),
                "tables": [
                    {
                        "name": table.name,
                        "columns_count": len(table.columns),
                        "columns": [
                            {
                                "name": col.name,
                                "data_type": col.data_type,
                                "is_primary_key": col.is_primary_key,
                                "is_foreign_key": col.is_foreign_key,
                                "foreign_key_reference": col.foreign_key_reference
                            } for col in table.columns
                        ],
                        "primary_keys": table.primary_keys,
                        "foreign_keys": table.foreign_keys
                    } for table in schema.tables
                ],
                "relationships": [
                    {
                        "from": f"{rel.from_table}.{rel.from_column}",
                        "to": f"{rel.to_table}.{rel.to_column}",
                        "type": rel.relationship_type
                    } for rel in schema.relationships
                ]
            },
            "ai_context_preview": ai_context
        }
        
    except Exception as e:
        # Log failed upload
        processing_time = int((time.time() - start_time) * 1000)
        if upload_id:
            await upload_history_service.log_upload_error(
                upload_id=upload_id,
                error_message=str(e),
                processing_time_ms=processing_time
            )
        raise HTTPException(status_code=500, detail=f"Schema processing failed: {str(e)}")

@app.get("/test-schemas")
async def list_test_schemas():
    """List all processed schemas for testing"""
    try:
        schemas = await schema_service.list_all_schemas()
        
        return {
            "status": "success",
            "total_schemas": len(schemas),
            "schemas": [
                {
                    "schema_id": schema.schema_id,
                    "schema_type": schema.schema_type.value,
                    "namespace": schema.namespace,
                    "file_name": schema.file_name,
                    "tables_count": len(schema.tables),
                    "relationships_count": len(schema.relationships),
                    "created_at": schema.created_at.isoformat(),
                    "description": schema.description
                } for schema in schemas
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list schemas: {str(e)}")

@app.post("/test-multi-schema-context")
async def test_multi_schema_context(schema_ids: list[str]):
    """Test cross-schema AI context generation"""
    try:
        ai_context = schema_service.generate_schema_context_for_ai(schema_ids)
        
        return {
            "status": "success",
            "message": "Multi-schema context generated",
            "schema_ids": schema_ids,
            "ai_context": ai_context
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-schema context generation failed: {str(e)}")

@app.get("/test-table-data/{schema_id}/{table_name}")
async def test_table_data(schema_id: str, table_name: str, limit: int = 5):
    """Test endpoint to verify tables were created with actual data"""
    try:
        sample_data = await schema_service.get_table_data_sample(schema_id, table_name, limit)
        
        return {
            "status": "success",
            "message": f"Retrieved sample data from {table_name}",
            "schema_id": schema_id,
            "table_name": table_name,
            "row_count": len(sample_data),
            "sample_data": sample_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve table data: {str(e)}")

@app.delete("/test-cleanup/{schema_id}")
async def cleanup_test_schema(schema_id: str):
    """Clean up test schema tables (useful for testing)"""
    try:
        success = await schema_service.drop_schema_tables(schema_id)
        
        if success:
            # Also remove from memory
            await schema_service.delete_schema(schema_id)
            
            return {
                "status": "success",
                "message": f"Schema {schema_id} and all its tables have been dropped",
                "schema_id": schema_id
            }
        else:
            return {
                "status": "warning", 
                "message": f"Schema {schema_id} not found or already dropped",
                "schema_id": schema_id
            }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to cleanup schema: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
