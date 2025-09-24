"""
Data insights endpoints for table-specific AI insights
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import asyncio
from app.auth import get_current_user, CurrentUser
from app.data.mock_insights import get_mock_table_insights

router = APIRouter(prefix="/data", tags=["data"])

class TableInsight(BaseModel):
    title: str
    metric: str
    change: str
    description: str
    trend: str
    data_points: List[float]

class TablePattern(BaseModel):
    title: str
    metric: str
    change: str
    description: str
    trend: str
    data_points: List[float]

class TableTemplate(BaseModel):
    title: str
    description: str
    category: str

class TableInsightsResponse(BaseModel):
    status: str
    insights: List[TableInsight]
    patterns: List[TablePattern]
    templates: List[TableTemplate]

@router.get("/insights/{table_name}", response_model=TableInsightsResponse)
async def get_table_insights(
    table_name: str):
    """
    Get AI insights for a specific table
    """
    try:
        # Simulate AI processing delay (1-3 seconds)
        processing_time = 1.5 + (hash(table_name) % 20) / 10  # 1.5-3.5 seconds
        await asyncio.sleep(processing_time)
        
        # For now, return mock data
        # In production, this would call the insights service
        mock_data = get_mock_table_insights(table_name)
        
        return TableInsightsResponse(
            status=mock_data["status"],
            insights=mock_data["insights"],
            patterns=mock_data["patterns"],
            templates=mock_data["templates"]
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get table insights: {str(e)}")

@router.get("/insights/{table_name}/refresh")
async def refresh_table_insights(
    table_name: str
):
    """
    Refresh AI insights for a specific table
    """
    try:
        # Simulate AI processing delay (2-4 seconds for refresh)
        processing_time = 2.0 + (hash(table_name) % 20) / 10  # 2.0-4.0 seconds
        await asyncio.sleep(processing_time)
        
        # For now, return the same mock data
        # In production, this would regenerate insights
        mock_data = get_mock_table_insights(table_name)
        
        return {
            "status": "success",
            "message": f"Insights refreshed for table: {table_name}",
            "insights": mock_data["insights"],
            "patterns": mock_data["patterns"],
            "templates": mock_data["templates"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refresh table insights: {str(e)}")
