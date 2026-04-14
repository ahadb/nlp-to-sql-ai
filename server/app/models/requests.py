"""
Request data models and validation schemas for QuantumSQL API
"""
from typing import Optional, List
from pydantic import BaseModel, Field
from enum import Enum


class DataSourceType(str, Enum):
    """Supported data source types"""
    SQL_SCHEMA = "sql_schema"
    CSV_FILE = "csv_file"


class SchemaUploadRequest(BaseModel):
    """Request model for uploading database schema or CSV data"""
    file_name: str = Field(..., description="Name of the uploaded file")
    file_content: str = Field(..., description="Content of the file (SQL schema or CSV data)")
    data_source_type: DataSourceType = Field(..., description="Type of data source being uploaded")
    description: Optional[str] = Field(None, description="Optional description of the data source")


class QueryGenerationRequest(BaseModel):
    """Request model for generating SQL from natural language"""
    natural_language_query: str = Field(..., description="Natural language question to convert to SQL")
    schema_id: str = Field(..., description="ID of the schema to query against")
    include_explanation: bool = Field(default=True, description="Whether to include query explanation")


class QueryExecutionRequest(BaseModel):
    """Request model for executing a SQL query"""
    sql_query: str = Field(..., description="SQL query to execute")
    schema_id: str = Field(..., description="ID of the schema to execute against")
    limit: Optional[int] = Field(default=100, description="Maximum number of rows to return")


class QueryHistoryRequest(BaseModel):
    """Request model for fetching query history"""
    user_id: Optional[str] = Field(None, description="User ID to filter history (optional)")
    limit: Optional[int] = Field(default=50, description="Maximum number of history items to return")
    offset: Optional[int] = Field(default=0, description="Offset for pagination")
