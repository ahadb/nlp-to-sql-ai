from fastapi import APIRouter, HTTPException
from app.services.insights_service import InsightsService

router = APIRouter(prefix="/insights", tags=["insights"])
insights_service = InsightsService()

@router.get("/dashboard/all")
async def get_all_org_insights():
    """Get insights across all schemas for organization-wide view"""
    try:
        # Just return mock insights (no database connections)
        return await insights_service.generate_dashboard_insights("all")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get all org insights: {str(e)}")

@router.get("/dashboard/{schema_id}")
async def get_dashboard_insights(schema_id: str):
    """Get insights for specific schema or all if 'all'"""
    try:
        # Just return mock insights (no database connections)
        return await insights_service.generate_dashboard_insights(schema_id)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get insights: {str(e)}")