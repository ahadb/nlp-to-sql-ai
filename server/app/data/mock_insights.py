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
            "change": "+2%",
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
            "change": "+12%",
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

# Mock table insights data for different table types
MOCK_TABLE_INSIGHTS: Dict[str, Dict[str, Any]] = {
    "sales_data": {
        "status": "success",
        "insights": [
            {
                "title": "Monthly Revenue",
                "metric": "$847K",
                "change": "+23.5%",
                "description": "Total revenue generated this month with strong Q4 performance",
                "trend": "up",
                "data_points": [420000, 445000, 380000, 510000, 680000, 720000, 847000]
            },
            {
                "title": "Top Performer",
                "metric": "Enterprise Plan",
                "change": "$125K",
                "description": "Highest revenue generating product this quarter",
                "trend": "up",
                "data_points": [85000, 92000, 98000, 105000, 118000, 125000]
            },
            {
                "title": "Customer Growth",
                "metric": "47 new",
                "change": "+18%",
                "description": "New customers acquired this month",
                "trend": "up",
                "data_points": [28, 32, 35, 38, 42, 45, 47]
            }
        ],
        "patterns": [
            {
                "title": "Peak Sales Hours",
                "metric": "2-4 PM",
                "change": "+12%",
                "description": "Highest conversion rate during afternoon hours",
                "trend": "up",
                "data_points": [8, 12, 15, 18, 22, 25, 28]
            },
            {
                "title": "Weekend Boost",
                "metric": "34% higher",
                "change": "+8%",
                "description": "Weekend sales consistently outperform weekdays",
                "trend": "up",
                "data_points": [22, 26, 28, 30, 32, 34]
            }
        ],
        "templates": [
            {
                "title": "Sales Data Analysis",
                "description": "Analyze sales performance, trends, and key metrics",
                "category": "Sales Analytics"
            },
            {
                "title": "Customer Insights",
                "description": "Deep dive into customer behavior and purchasing patterns",
                "category": "Customer Intelligence"
            },
            {
                "title": "Revenue Optimization",
                "description": "Identify opportunities to maximize revenue and growth",
                "category": "Revenue Strategy"
            }
        ]
    },
    "billing_data": {
        "status": "success",
        "insights": [
            {
                "title": "Cash Flow",
                "metric": "$2.1M",
                "change": "+15%",
                "description": "Total cash collected this month from invoices",
                "trend": "up",
                "data_points": [1800000, 1850000, 1920000, 1980000, 2050000, 2100000]
            },
            {
                "title": "Payment Speed",
                "metric": "12 days",
                "change": "-4 days",
                "description": "Average time from invoice to payment",
                "trend": "down",
                "data_points": [18, 16, 15, 14, 13, 12]
            },
            {
                "title": "Collection Rate",
                "metric": "96.2%",
                "change": "+1.8%",
                "description": "Percentage of invoices paid on time",
                "trend": "up",
                "data_points": [92, 93, 94, 95, 95.5, 96.2]
            }
        ],
        "patterns": [
            {
                "title": "Payment Timing",
                "metric": "End of Month",
                "change": "+8%",
                "description": "Most payments received in last week of month",
                "trend": "up",
                "data_points": [65, 68, 72, 75, 78, 82]
            },
            {
                "title": "Overdue Risk",
                "metric": "3.8%",
                "change": "-1.2%",
                "description": "Invoices becoming overdue decreased significantly",
                "trend": "down",
                "data_points": [6.2, 5.8, 5.2, 4.8, 4.2, 3.8]
            }
        ],
        "templates": [
            {
                "title": "Billing Data Analysis",
                "description": "Analyze billing patterns, payment trends, and financial health",
                "category": "Billing Analytics"
            },
            {
                "title": "Payment Insights",
                "description": "Deep dive into payment behavior and collection patterns",
                "category": "Payment Intelligence"
            },
            {
                "title": "Financial Optimization",
                "description": "Identify opportunities to improve cash flow and reduce risk",
                "category": "Financial Strategy"
            }
        ]
    },
    "support_data": {
        "status": "success",
        "insights": [
            {
                "title": "Response Time",
                "metric": "1.2 hours",
                "change": "-0.3h",
                "description": "Average time to first response on support tickets",
                "trend": "down",
                "data_points": [2.1, 1.8, 1.6, 1.4, 1.3, 1.2]
            },
            {
                "title": "Customer Rating",
                "metric": "4.8/5",
                "change": "+0.3",
                "description": "Average customer satisfaction score",
                "trend": "up",
                "data_points": [4.2, 4.3, 4.5, 4.6, 4.7, 4.8]
            },
            {
                "title": "Ticket Volume",
                "metric": "247 tickets",
                "change": "+12%",
                "description": "Total support tickets handled this month",
                "trend": "up",
                "data_points": [180, 195, 210, 225, 235, 247]
            }
        ],
        "patterns": [
            {
                "title": "Busy Hours",
                "metric": "10 AM - 2 PM",
                "change": "+15%",
                "description": "Peak support request times during business hours",
                "trend": "up",
                "data_points": [25, 28, 32, 35, 38, 42]
            },
            {
                "title": "Issue Types",
                "metric": "Account Access",
                "change": "+8%",
                "description": "Most common support issue this month",
                "trend": "up",
                "data_points": [18, 22, 25, 28, 32, 35]
            }
        ],
        "templates": [
            {
                "title": "Support Data Analysis",
                "description": "Analyze support ticket performance, response times, and resolution patterns",
                "category": "Support Analytics"
            },
            {
                "title": "Customer Experience",
                "description": "Deep dive into customer satisfaction and feedback trends",
                "category": "Customer Experience"
            },
            {
                "title": "Support Optimization",
                "description": "Identify opportunities to improve support efficiency and quality",
                "category": "Process Improvement"
            }
        ]
    }
}

def get_mock_table_insights(table_name: str) -> Dict[str, Any]:
    """Get mock table insights for specific table"""
    # Default insights for unknown tables
    default_insights = {
        "status": "success",
        "insights": [
            {
                "title": "Data Completeness",
                "metric": "96.4%",
                "change": "+2.1%",
                "description": "Percentage of records with complete data fields",
                "trend": "up",
                "data_points": [89, 91, 93, 94, 95, 96.4]
            },
            {
                "title": "Record Volume",
                "metric": "2,847",
                "change": "+18%",
                "description": "Total records processed this month",
                "trend": "up",
                "data_points": [1800, 2100, 2400, 2600, 2750, 2847]
            },
            {
                "title": "Data Freshness",
                "metric": "2 hours",
                "change": "-0.5h",
                "description": "Average time since last data update",
                "trend": "down",
                "data_points": [4.2, 3.8, 3.2, 2.8, 2.5, 2.0]
            }
        ],
        "patterns": [
            {
                "title": "Update Frequency",
                "metric": "Daily",
                "change": "+12%",
                "description": "Data is updated consistently every day",
                "trend": "up",
                "data_points": [78, 82, 85, 88, 91, 95]
            },
            {
                "title": "Data Quality",
                "metric": "High",
                "change": "Stable",
                "description": "Consistent high-quality data patterns",
                "trend": "stable",
                "data_points": [92, 93, 94, 95, 94, 96]
            }
        ],
        "templates": [
            {
                "title": "Data Overview",
                "description": "Generate comprehensive data quality and volume reports",
                "category": "Data Analytics"
            },
            {
                "title": "Quality Metrics",
                "description": "Analyze data completeness and accuracy trends",
                "category": "Quality Analysis"
            },
            {
                "title": "Usage Patterns",
                "description": "Track data access and update patterns over time",
                "category": "Usage Analytics"
            }
        ]
    }
    
    # Return specific insights if available, otherwise default
    return MOCK_TABLE_INSIGHTS.get(table_name.lower(), default_insights)
