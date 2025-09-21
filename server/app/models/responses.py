"""
Response data models and serialization schemas for QuantumSQL API
"""
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class ResponseStatus(str, Enum):
    """Standard response status values"""
    SUCCESS = "success"
    ERROR = "error"
    WARNING = "warning"


class BaseResponse(BaseModel):
    """Base response model with common fields"""
    status: ResponseStatus = Field(..., description="Response status")
    message: str = Field(..., description="Human-readable message")
    timestamp: datetime = Field(default_factory=datetime.now, description="Response timestamp")


class SchemaUploadResponse(BaseResponse):
    """Response model for schema upload operations"""
    schema_id: Optional[str] = Field(None, description="Unique identifier for the uploaded schema")
    tables_detected: Optional[List[str]] = Field(None, description="List of detected table names")
    columns_count: Optional[int] = Field(None, description="Total number of columns detected")


class QueryGenerationResponse(BaseResponse):
    """Response model for SQL query generation"""
    generated_sql: Optional[str] = Field(None, description="Generated SQL query")
    explanation: Optional[str] = Field(None, description="Explanation of the generated query")
    confidence_score: Optional[float] = Field(None, description="AI confidence score (0-1)")
    query_id: Optional[str] = Field(None, description="Unique identifier for this query")


class QueryExecutionResponse(BaseResponse):
    """Response model for SQL query execution"""
    results: Optional[List[Dict[str, Any]]] = Field(None, description="Query execution results")
    row_count: Optional[int] = Field(None, description="Number of rows returned")
    execution_time_ms: Optional[float] = Field(None, description="Query execution time in milliseconds")
    columns: Optional[List[str]] = Field(None, description="Column names in the result set")


class QueryHistoryItem(BaseModel):
    """Individual query history item"""
    query_id: str = Field(..., description="Unique query identifier")
    natural_language_query: str = Field(..., description="Original natural language question")
    generated_sql: str = Field(..., description="Generated SQL query")
    created_at: datetime = Field(..., description="When the query was created")
    execution_status: Optional[str] = Field(None, description="Last execution status")


class QueryHistoryResponse(BaseResponse):
    """Response model for query history"""
    queries: Optional[List[QueryHistoryItem]] = Field(None, description="List of query history items")
    total_count: Optional[int] = Field(None, description="Total number of queries in history")
    page_info: Optional[Dict[str, Any]] = Field(None, description="Pagination information")


class ErrorResponse(BaseResponse):
    """Response model for error cases"""
    error_code: Optional[str] = Field(None, description="Specific error code for debugging")
    error_details: Optional[Dict[str, Any]] = Field(None, description="Additional error context")
