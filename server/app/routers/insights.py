from fastapi import APIRouter, HTTPException
from app.services.insights_service import InsightsService
from app.database import get_db_connection

router = APIRouter(prefix="/insights", tags=["insights"])
insights_service = InsightsService()

# app/routers/insights.py
@router.get("/dashboard/all")
async def get_all_org_insights():
    print('HERE')
    """Get insights across all schemas for organization-wide view"""
    try:
        # Check if insights already exist for 'all'
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT insight_type, title, description, confidence_score
                    FROM insights 
                    WHERE schema_id = 'all'
                    ORDER BY insight_type, created_at DESC
                """)
                
                existing_insights = cur.fetchall()
                
                if existing_insights:
                    # Return existing insights
                    
                    return await insights_service.generate_dashboard_insights("all")
                else:
                    print('CALLING GEN AI')
                    # Generate new insights for all schemas
                    return await insights_service.generate_dashboard_insights("all")
                    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get all org insights: {str(e)}")

@router.get("/dashboard/{schema_id}")
async def get_dashboard_insights(schema_id: str):
    """Get insights for specific schema or all if 'all'"""
    try:
        # Check if insights already exist
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT insight_type, title, description, confidence_score
                    FROM insights 
                    WHERE schema_id = %s
                    ORDER BY insight_type, created_at DESC
                """, (schema_id,))
                
                existing_insights = cur.fetchall()
                
                if existing_insights:
                    # Return existing insights
                    insights = []
                    patterns = []
                    
                    for row in existing_insights:
                        item = {
                            "title": row[1],
                            "description": row[2],
                            "confidence": row[3]
                        }
                        
                        if row[0] == "insight":
                            insights.append(item)
                        else:
                            patterns.append(item)
                    
                    return {
                        "status": "success",
                        "insights": insights,
                        "patterns": patterns
                    }
                else:
                    # Generate new insights
                    return await insights_service.generate_dashboard_insights(schema_id)
                    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get insights: {str(e)}")