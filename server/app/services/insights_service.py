# app/services/insights_service.py
from app.data.mock_insights import get_mock_dashboard_insights

class InsightsService:
    def __init__(self):
        pass
    
    async def generate_dashboard_insights(self, schema_id: str):
        """Generate dashboard insights - always returns mock data"""
        try:
            # Always return mock insights (no database connections, no AI calls)
            return get_mock_dashboard_insights()
            
        except Exception as e:
            return {"status": "error", "message": str(e)}