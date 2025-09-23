"""
Mock insights and patterns data for demo mode
"""
from typing import Dict, Any

# Mock insights and patterns for dashboard cards
MOCK_DASHBOARD_INSIGHTS: Dict[str, Any] = {
    "status": "success",
    "insights": [
        {
            "title": "Total Revenue",
            "metric": "$6.5M",
            "change": "+10%",
            "description": "Total revenue generated in the last quarter.",
            "trend": "up",
            "data_points": [
                450000,
                780000,
                320000,
                890000,
                1200000
            ]
        },
        {
            "title": "Customer Satisfaction",
            "metric": "4.5/5",
            "change": "↗️",
            "description": "Average satisfaction rating from support tickets resolved.",
            "trend": "up",
            "data_points": [
                5,
                4,
                5,
                5,
                4
            ]
        }
    ],
    "patterns": [
        {
            "title": "Late Payments",
            "metric": "10%",
            "change": "+5%",
            "description": "Increase in overdue invoices this month",
            "trend": "up",
            "data_points": [
                5,
                7,
                8,
                9,
                10
            ]
        },
        {
            "title": "High Satisfaction",
            "metric": "90%",
            "change": "↗️",
            "description": "Customer satisfaction remains high across support tickets",
            "trend": "stable",
            "data_points": [
                5,
                4,
                5,
                4,
                5
            ]
        }
    ]
}

def get_mock_dashboard_insights() -> Dict[str, Any]:
    """Get mock dashboard insights for demo mode"""
    return MOCK_DASHBOARD_INSIGHTS
