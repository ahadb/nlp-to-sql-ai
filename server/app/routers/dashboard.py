"""
Dashboard endpoints for business intelligence overview
"""
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from app.auth import get_current_user, CurrentUser

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

class DashboardStats(BaseModel):
    total_records: int
    active_sources: int
    data_freshness: str
    query_volume: int
    revenue_trend: float
    customer_growth: float

class DashboardResponse(BaseModel):
    status: str
    stats: DashboardStats
    recent_activity: List[Dict[str, Any]]
    top_insights: List[Dict[str, Any]]

@router.get("/", response_model=DashboardResponse)
async def get_dashboard_overview(current_user: CurrentUser = Depends(get_current_user)):
    """
    Get dashboard overview with key business metrics
    """
    try:
        from ..database import get_connection
        
        # Get connection to query PostgreSQL
        conn = get_connection()
        cursor = conn.cursor()
        
        # Calculate total records across all user tables
        cursor.execute("""
            SELECT COUNT(*) as table_count
            FROM information_schema.tables 
            WHERE table_schema NOT IN ('information_schema', 'pg_catalog', 'pg_toast', 'public')
        """)
        active_sources = cursor.fetchone()[0] or 0
        
        # Mock data for now - in production, calculate from actual user data
        stats = DashboardStats(
            total_records=12500,  # Could calculate from actual tables
            active_sources=active_sources,
            data_freshness="2 hours ago",
            query_volume=45,
            revenue_trend=12.5,
            customer_growth=8.3
        )
        
        recent_activity = [
            {
                "action": "Data Upload",
                "file": "sales_q4.csv",
                "timestamp": "2 hours ago",
                "status": "success"
            },
            {
                "action": "Query Execution",
                "query": "Top customers by revenue",
                "timestamp": "4 hours ago", 
                "status": "success"
            }
        ]
        
        top_insights = [
            {
                "title": "Revenue Growth",
                "value": "+12.5%",
                "trend": "up",
                "description": "Compared to last month"
            },
            {
                "title": "Customer Acquisition",
                "value": "+8.3%",
                "trend": "up", 
                "description": "New customers this quarter"
            }
        ]
        
        cursor.close()
        conn.close()
        
        return DashboardResponse(
            status="success",
            stats=stats,
            recent_activity=recent_activity,
            top_insights=top_insights
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get dashboard data: {str(e)}")

@router.get("/stats")
async def get_dashboard_stats(current_user: CurrentUser = Depends(get_current_user)):
    """
    Get detailed dashboard statistics
    """
    try:
        # This would connect to your analytics/metrics system
        return {
            "status": "success",
            "user_id": current_user.user_id,
            "metrics": {
                "queries_today": 23,
                "data_sources": 5,
                "insights_generated": 12,
                "last_activity": datetime.now().isoformat()
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")
