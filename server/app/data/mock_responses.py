"""
AI responses for demo mode
"""
from typing import Dict, Any

# Responses for each template
MOCK_RESPONSES: Dict[str, Dict[str, Any]] = {
    "top-customers": {
        "ai_response": """Here's what I found regarding your top 5 customers by revenue:

## Key Insights
- **Top Revenue Generators**: 
    - **Zeta Dynamics** leads with a revenue of **$1,500,000**.
    - Followed closely by **Omega Corp** at **$1,400,000** and **Upsilon Tech** at **$1,300,000**.
  
- **Customer Status**:
    - Four out of the five customers are classified as **VIP**, indicating a high level of importance and potentially strong loyalty.
  
- **Industry Representation**:
    - The customers span diverse industries including **Aerospace**, **Pharmaceuticals**, **AI/ML**, and **Finance**, showcasing a broad market reach.
  
- **Geographical Distribution**:
    - The majority of top customers are based in the **USA** (4 out of 5), with **Ridge Corp** located in the **UK**.

- **Total Orders**:
    - Zeta Dynamics has the highest number of total orders at **298**, which may indicate strong product demand or service engagement.

| Company Name     | Revenue   | Industry      | Country | Total Orders | Customer Status | Sales Rep       |
|------------------|-----------|---------------|---------|--------------|------------------|------------------|
| Zeta Dynamics     | $1,500,000 | Aerospace     | USA     | 298          | VIP              | Jennifer Wu      |
| Omega Corp        | $1,400,000 | Pharmaceuticals | USA     | 267          | VIP              | Eric Lee         |
| Upsilon Tech      | $1,300,000 | AI/ML        | USA     | 245          | VIP              | James Wilson     |
| Ridge Corp        | $1,250,000 | Finance       | UK      | 189          | VIP              | Lucas Brown      |
| Alpha Corp        | $1,200,000 | Finance       | USA     | 234          | Active           | Tom Wilson       |

## Business Recommendations
- **Enhance Engagement with VIP Customers**: Given the high revenue contribution from VIP customers, consider personalized marketing strategies and loyalty programs to deepen engagement and enhance retention.
  
- **Cross-Selling Opportunities**: Analyze order histories to identify potential cross-selling opportunities, especially in the **Finance** and **AI/ML** sectors, where customers like Ridge Corp and Upsilon Tech might benefit from additional offerings.

- **Geographic Strategy**: With a concentration in the USA, explore expansion strategies or tailored marketing approaches for international markets, specifically the UK, where Ridge Corp is located.

- **Monitor Performance Metrics**: Track the performance and satisfaction of these top customers closely. If their order volume decreases, it may indicate underlying issues that need to be addressed.

## Next Steps
- **Follow-Up Questions**:
    - What specific products or services are these top customers purchasing?
    - How does the customer satisfaction rate compare across these top 5 customers?

- **Related Analyses**:
    - Conduct a customer segmentation analysis to identify other high-potential customers who may not yet be in the top revenue bracket.
    - Analyze trends over time to see how revenue from these customers has shifted, particularly post any significant campaigns or product launches.

- **Data Exploration Recommendations**:
    - Investigate the impact of industry trends on these customers' purchasing behaviors.
    - Examine the effectiveness of different sales representatives linked to these customers and identify best practices.

By following these insights and recommendations, your organization can better leverage its top customers for sustained growth and profitability.""",
        
        "sql_query": """SELECT 
    company_name,
    revenue,
    contact_name,
    email,
    phone,
    industry,
    country,
    state,
    city,
    total_orders,
    customer_status,
    sales_rep
FROM 
    sales_precise_test.sales_precise_test_data
ORDER BY 
    revenue DESC
LIMIT 5;""",
        
        "query_results": {
            "columns": [
                "company_name",
                "revenue",
                "contact_name",
                "email",
                "phone",
                "industry",
                "country",
                "state",
                "city",
                "total_orders",
                "customer_status",
                "sales_rep"
            ],
            "data": [
                {
                    "company_name": "Zeta Dynamics",
                    "revenue": 1500000,
                    "contact_name": "Matthew Garcia",
                    "email": "matt@zetadyn.com",
                    "phone": "+1-555-0110",
                    "industry": "Aerospace",
                    "country": "USA",
                    "state": "California",
                    "city": "Los Angeles",
                    "total_orders": 298,
                    "customer_status": "VIP",
                    "sales_rep": "Jennifer Wu"
                },
                {
                    "company_name": "Omega Corp",
                    "revenue": 1400000,
                    "contact_name": "Kayla Robinson",
                    "email": "kayla@omegacorp.com",
                    "phone": "+1-555-0125",
                    "industry": "Pharmaceuticals",
                    "country": "USA",
                    "state": "New Jersey",
                    "city": "Newark",
                    "total_orders": 267,
                    "customer_status": "VIP",
                    "sales_rep": "Eric Lee"
                },
                {
                    "company_name": "Upsilon Tech",
                    "revenue": 1300000,
                    "contact_name": "Nicole White",
                    "email": "nicole@upsilontech.io",
                    "phone": "+1-555-0121",
                    "industry": "AI/ML",
                    "country": "USA",
                    "state": "California",
                    "city": "Palo Alto",
                    "total_orders": 245,
                    "customer_status": "VIP",
                    "sales_rep": "James Wilson"
                },
                {
                    "company_name": "Ridge Corp",
                    "revenue": 1250000,
                    "contact_name": "Quinn Green",
                    "email": "quinn@ridgecorp.com",
                    "phone": "+44-20-7946-0958",
                    "industry": "Finance",
                    "country": "UK",
                    "state": "England",
                    "city": "London",
                    "total_orders": 189,
                    "customer_status": "VIP",
                    "sales_rep": "Lucas Brown"
                },
                {
                    "company_name": "Alpha Corp",
                    "revenue": 1200000,
                    "contact_name": "Jennifer Brown",
                    "email": "jen@alphacorp.com",
                    "phone": "+1-555-0105",
                    "industry": "Finance",
                    "country": "USA",
                    "state": "Illinois",
                    "city": "Chicago",
                    "total_orders": 234,
                    "customer_status": "Active",
                    "sales_rep": "Tom Wilson"
                }
            ],
            "row_count": 5
        }
    },
    
    "revenue-trends": {
        "ai_response": """Here's what I found regarding your revenue trends for the last six months.

## Key Insights
- **Strong Revenue Growth**: Revenue has shown consistent growth over the past 6 months, increasing from **$1.2M** in July to **$1.8M** in December.
- **Monthly Performance**: 
  - **July**: $1,200,000 (baseline)
  - **August**: $1,350,000 (+12.5% growth)
  - **September**: $1,420,000 (+5.2% growth)
  - **October**: $1,580,000 (+11.3% growth)
  - **November**: $1,650,000 (+4.4% growth)
  - **December**: $1,800,000 (+9.1% growth)
- **Average Monthly Growth**: **8.7%** month-over-month growth rate
- **Total 6-Month Revenue**: **$9,000,000** across all months
- **Peak Performance**: December shows the highest revenue at **$1.8M**

## Business Recommendations
- **Maintain Growth Momentum**: The consistent growth pattern suggests strong market demand and effective sales strategies.
- **Q4 Optimization**: December's peak performance indicates strong holiday season sales - consider expanding Q4 marketing efforts.
- **Forecast Planning**: With 8.7% average growth, plan for continued expansion in the coming months.
- **Resource Allocation**: Ensure adequate resources are available to support the growing revenue demands.

## Next Steps
- **Follow-Up Questions**:
  - What specific factors are driving the consistent revenue growth?
  - Are there seasonal patterns we should account for in future planning?

- **Related Analyses**: 
  - Analyze customer acquisition trends to understand the growth drivers.
  - Review product performance to identify top revenue generators.

- **Data Exploration Recommendations**:
  - Investigate revenue by customer segment to optimize targeting.
  - Analyze sales team performance during high-growth periods.

> **Excellent Performance**: Your revenue trends show strong, consistent growth with no signs of slowing down!""",
        
        "sql_query": """SELECT 
    DATE_TRUNC('month', last_order_date::date) AS month,
    SUM(revenue) AS total_revenue
FROM 
    sales_precise_test.sales_precise_test_data
WHERE 
    last_order_date::date >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY 
    month
ORDER BY 
    month;""",
        
        "query_results": {
            "columns": [
                "month",
                "total_revenue"
            ],
            "data": [
                {
                    "month": "2024-07-01",
                    "total_revenue": 1200000.0
                },
                {
                    "month": "2024-08-01",
                    "total_revenue": 1350000.0
                },
                {
                    "month": "2024-09-01",
                    "total_revenue": 1420000.0
                },
                {
                    "month": "2024-10-01",
                    "total_revenue": 1580000.0
                },
                {
                    "month": "2024-11-01",
                    "total_revenue": 1650000.0
                },
                {
                    "month": "2024-12-01",
                    "total_revenue": 1800000.0
                }
            ],
            "row_count": 6
        }
    },
    
    "customer-satisfaction": {
        "ai_response": """Your query executed successfully! Here's what I found regarding your support ticket performance and customer satisfaction.

## Key Insights
- **Total Tickets**: **100** tickets were logged in the dataset, indicating a significant volume of customer inquiries.
- **Average Response Time**: The average response time is approximately **27.25 hours**, suggesting there may be room for improvement in response efficiency.
- **Average Satisfaction Rating**: Customers rated their satisfaction at an average of **4.55 out of 5**, which is a strong indicator of overall customer satisfaction.
- **Ticket Resolution Status**: There are **0 resolved tickets** and **0 open tickets** recorded, which seems unusual given the total ticket count. This may indicate an issue with data accuracy or ticket status tracking.
- **High Priority Tickets**: There are **0 high priority tickets**, suggesting that either there are no urgent issues being reported or that ticket categorization may need reviewing.

> **Important Insight**: The high number of total tickets alongside the lack of resolved or open tickets raises questions about the data integrity or definitions of ticket status.

## Business Recommendations
- **Investigate Data Integrity**: Review the ticket tracking system to ensure that ticket statuses are recorded accurately. This could involve auditing the ticket system or re-evaluating the criteria for ticket resolution.
- **Enhance Response Times**: With an average response time exceeding a day, consider implementing automated responses for common inquiries or additional training for support agents to improve efficiency.
- **Monitor Customer Satisfaction**: Continue to track customer satisfaction ratings closely and proactively address any feedback to maintain or improve satisfaction levels.
- **Evaluate Ticket Categorization**: Ensure that tickets are categorized correctly, especially regarding priority levels, to better manage urgent issues and allocate resources effectively.

## Next Steps
- **Follow-Up Questions**:
  - What specific challenges are agents facing in resolving tickets?
  - Are there common themes or categories that could inform process improvements?
  
- **Related Analyses**:
  - Analyze ticket resolution times to identify bottlenecks in the support process.
  - Conduct a deeper dive into customer feedback to understand the reasons behind the satisfaction scores.

- **Data Exploration Recommendations**:
  - Explore ticket data over time to identify trends in ticket volume and response efficiency.
  - Investigate customer demographics to tailor support efforts effectively.

Feel free to reach out if you have more questions or need further analysis on specific aspects of your support ticket performance!""",
        
        "sql_query": """SELECT 
    COUNT(ticket_id) AS total_tickets,
    AVG(response_time_hours) AS average_response_time,
    AVG(satisfaction_rating) AS average_satisfaction_rating,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) AS resolved_tickets,
    COUNT(CASE WHEN status = 'open' THEN 1 END) AS open_tickets,
    COUNT(CASE WHEN priority = 'high' THEN 1 END) AS high_priority_tickets
FROM 
    support_precise_test.support_precise_test_data;""",
        
        "query_results": {
            "columns": [
                "total_tickets",
                "average_response_time",
                "average_satisfaction_rating",
                "resolved_tickets",
                "open_tickets",
                "high_priority_tickets"
            ],
            "data": [
                {
                    "total_tickets": 100,
                    "average_response_time": 27.252,
                    "average_satisfaction_rating": 4.553191489361702,
                    "resolved_tickets": 0,
                    "open_tickets": 0,
                    "high_priority_tickets": 0
                }
            ],
            "row_count": 1
        }
    },
    
    "sales-performance": {
        "ai_response": """Here's what I found regarding your billing insights, focusing on overdue payments and payment methods.

## Key Insights
- **Total Overdue Invoices**: There are **7 invoices** that are currently overdue.
- **Payment Status**: 
  - **5 invoices** have a payment status of **Overdue**.
  - **1 invoice** is marked as **Refunded**.
- **Payment Methods**:
  - **3 invoices** have **no payment method** recorded.
  - **1 invoice** was paid via **Credit Card**.
- **Days Overdue**: 
  - The invoices range from **0 days** (recently overdue) to potentially longer overdue periods.
- **Highest Amount Due**: The amounts for overdue invoices are consistently **$450** and **$299** across the board.

| Invoice ID | Customer Name    | Email                      | Invoice Date | Due Date    | Amount | Payment Status | Payment Method | Days Overdue  |
|------------|------------------|---------------------------|--------------|-------------|--------|----------------|----------------|---------------|
| 9          | Amanda Thompson   | amanda@epsilontech.io     | 2024-12-01   | 2024-12-31  | 450.0  | Overdue        | NULL           | David Lee     |
| 26         | Connor Walker     | connor@apexsol.com        | 2024-10-01   | 2024-10-31  | 450.0  | Refunded       | Credit Card    | 0             |
| 45         | Marina Parker     | marina@reefsol.com        | 2024-07-01   | 2024-07-31  | 299.0  | Overdue        | NULL           | Caleb Kim     |
| 58         | Taylor Brooks     | taylor@fusiontech.io      | 2024-04-01   | 2024-04-30  | 450.0  | Overdue        | NULL           | Rachel Kim    |
| 71         | Morgan Scott      | morgan@alphawave.com      | 2024-01-01   | 2024-01-31  | 450.0  | Overdue        | NULL           | James Wilson   |
| 87         | Taylor Cook       | taylor@techfusion.com     | 2023-09-01   | 2023-09-30  | 450.0  | Overdue        | NULL           | Noah Martinez   |
| 100        | Riley Adams       | riley@fusionpoint.com     | 2023-05-01   | 2023-05-31  | 450.0  | Overdue        | NULL           | Iris Martinez   |

## Business Recommendations
- **Follow Up on Overdue Invoices**: Initiate contact with customers who have overdue payments to encourage prompt payment. Consider sending reminders or offering flexible payment options.
- **Review Payment Methods**: Investigate why a significant number of overdue invoices lack a recorded payment method. This could indicate a potential issue in the billing process or customer experience.
- **Analyze Customer Behavior**: Look into the payment history of customers with overdue invoices to identify patterns that may indicate risk or the need for improved credit terms.
- **Implement Late Fees**: Consider implementing or enforcing late fees to encourage timely payments and reduce future overdue occurrences.

## Next Steps
- **Suggested Follow-Up Questions**:
  - What strategies can be employed to reduce overdue payments in the future?
  - Are there specific customer segments that frequently have overdue invoices?
  
- **Related Analyses**:
  - Analyzing payment trends over time to identify any seasonal patterns in overdue payments.
  - Examining customer demographics and their correlation with payment behavior.

- **Data Exploration Recommendations**:
  - Dive deeper into the payment method data to evaluate customer preferences and the impact on payment timeliness.
  - Assess the effectiveness of communication strategies with overdue customers to improve collections.

> By taking proactive measures in billing and customer engagement, you can significantly enhance cash flow and customer satisfaction.""",
        
        "sql_query": """SELECT 
    invoice_id,
    customer_name,
    customer_email,
    invoice_date,
    due_date,
    amount,
    payment_status,
    payment_method,
    days_over_due
FROM 
    billing_precise_test.billing_precise_test_data
WHERE 
    payment_status != 'Paid' AND 
    due_date::date < CURRENT_DATE;""",
        
        "query_results": {
            "columns": [
                "invoice_id",
                "customer_name",
                "customer_email",
                "invoice_date",
                "due_date",
                "amount",
                "payment_status",
                "payment_method",
                "days_over_due"
            ],
            "data": [
                {
                    "invoice_id": 9,
                    "customer_name": "Amanda Thompson",
                    "customer_email": "amanda@epsilontech.io",
                    "invoice_date": "2024-12-01",
                    "due_date": "2024-12-31",
                    "amount": 450.0,
                    "payment_status": "Overdue",
                    "payment_method": "",
                    "days_over_due": "David Lee"
                },
                {
                    "invoice_id": 26,
                    "customer_name": "Connor Walker",
                    "customer_email": "connor@apexsol.com",
                    "invoice_date": "2024-10-01",
                    "due_date": "2024-10-31",
                    "amount": 450.0,
                    "payment_status": "Refunded",
                    "payment_method": "Credit Card",
                    "days_over_due": "0"
                },
                {
                    "invoice_id": 45,
                    "customer_name": "Marina Parker",
                    "customer_email": "marina@reefsol.com",
                    "invoice_date": "2024-07-01",
                    "due_date": "2024-07-31",
                    "amount": 299.0,
                    "payment_status": "Overdue",
                    "payment_method": "",
                    "days_over_due": "Caleb Kim"
                },
                {
                    "invoice_id": 58,
                    "customer_name": "Taylor Brooks",
                    "customer_email": "taylor@fusiontech.io",
                    "invoice_date": "2024-04-01",
                    "due_date": "2024-04-30",
                    "amount": 450.0,
                    "payment_status": "Overdue",
                    "payment_method": "",
                    "days_over_due": "Rachel Kim"
                },
                {
                    "invoice_id": 71,
                    "customer_name": "Morgan Scott",
                    "customer_email": "morgan@alphawave.com",
                    "invoice_date": "2024-01-01",
                    "due_date": "2024-01-31",
                    "amount": 450.0,
                    "payment_status": "Overdue",
                    "payment_method": "",
                    "days_over_due": "James Wilson"
                },
                {
                    "invoice_id": 87,
                    "customer_name": "Taylor Cook",
                    "customer_email": "taylor@techfusion.com",
                    "invoice_date": "2023-09-01",
                    "due_date": "2023-09-30",
                    "amount": 450.0,
                    "payment_status": "Overdue",
                    "payment_method": "",
                    "days_over_due": "Noah Martinez"
                },
                {
                    "invoice_id": 100,
                    "customer_name": "Riley Adams",
                    "customer_email": "riley@fusionpoint.com",
                    "invoice_date": "2023-05-01",
                    "due_date": "2023-05-31",
                    "amount": 450.0,
                    "payment_status": "Overdue",
                    "payment_method": "",
                    "days_over_due": "Iris Martinez"
                }
            ],
            "row_count": 7
        }
    },
    
    "inventory-analysis": {
        "ai_response": """Here's what I found regarding your customer segmentation by subscription tier.

## Key Insights
- **Customer Distribution**:
  - **Basic Tier**: 6 customers
  - **Professional Tier**: 77 customers
  - **Enterprise Tier**: 17 customers
- **Average Revenue**:
  - **Basic**: $328,333
  - **Professional**: $590,779
  - **Enterprise**: $1,008,235
- **Average Employees**:
  - **Basic**: 52.5 employees
  - **Professional**: 104.9 employees
  - **Enterprise**: 240.6 employees
- **Average Total Orders**:
  - **Basic**: 29.5 orders
  - **Professional**: 74.5 orders
  - **Enterprise**: 165.6 orders

> Notably, the **Enterprise tier** customers not only represent the highest average revenue but also have significantly more employees and total orders compared to other tiers.

## Business Recommendations
- **Focus on Enterprise Growth**:
  - Given their higher average revenue and order volume, consider enhancing marketing efforts tailored to attract more **Enterprise customers**.
- **Optimize Professional Tier Offerings**:
  - With a substantial customer base in the **Professional tier**, evaluate opportunities to upsell or cross-sell to increase their average revenue.
- **Customer Engagement**:
  - Implement targeted engagement strategies for the **Basic tier customers** to understand their needs better and potentially upgrade them to higher tiers.
- **Retention Strategies**:
  - High average order counts in the **Enterprise tier** suggest strong loyalty. Develop retention strategies to ensure these customers remain engaged and satisfied.

## Next Steps
- **Follow-Up Questions**:
  - What specific characteristics or needs do customers in each tier have?
  - Are there any trends in customer feedback or support tickets that correlate with subscription tiers?
  
- **Related Analyses**:
  - Analyze churn rates across different subscription tiers to identify potential risks.
  - Explore customer demographics (industry, location) to understand market segments better.

- **Data Exploration Recommendations**:
  - Investigate customer journey metrics for each tier to identify points of friction or opportunities for improvement.
  - Assess the impact of marketing campaigns on customer acquisition and retention by tier.

By leveraging these insights and recommendations, you can drive strategic decision-making and enhance your customer engagement strategies. If you need further analysis or assistance, feel free to ask!""",
        
        "sql_query": """SELECT 
    subscription_tier,
    COUNT(customer_id) AS customer_count,
    AVG(revenue) AS average_revenue,
    AVG(employees) AS average_employees,
    AVG(total_orders) AS average_total_orders
FROM 
    sales_precise_test.sales_precise_test_data
GROUP BY 
    subscription_tier
ORDER BY 
    subscription_tier;""",
        
        "query_results": {
            "columns": [
                "subscription_tier",
                "customer_count",
                "average_revenue",
                "average_employees",
                "average_total_orders"
            ],
            "data": [
                {
                    "subscription_tier": "Basic",
                    "customer_count": 6,
                    "average_revenue": 328333.3333333333,
                    "average_employees": 52.5,
                    "average_total_orders": 29.5
                },
                {
                    "subscription_tier": "Enterprise",
                    "customer_count": 17,
                    "average_revenue": 1008235.2941176471,
                    "average_employees": 240.58823529411765,
                    "average_total_orders": 165.64705882352942
                },
                {
                    "subscription_tier": "Professional",
                    "customer_count": 77,
                    "average_revenue": 590779.2207792208,
                    "average_employees": 104.9090909090909,
                    "average_total_orders": 74.49350649350649
                }
            ],
            "row_count": 3
        }
    },
    
    "sales-data-analysis": {
        "ai_response": """Here's what I found regarding your comprehensive sales data analysis including performance trends and key metrics.

## Key Insights
- **Revenue Performance**: Your sales data shows strong performance with **$847K** in monthly revenue, representing a **+23.5%** growth trend.
- **Top Performing Product**: The **Enterprise Plan** is your highest revenue generator at **$125K**, indicating strong demand for premium offerings.
- **Customer Acquisition**: You've acquired **47 new customers** this month, showing **+18%** growth in customer base.
- **Peak Sales Performance**: Sales peak during **2-4 PM** with **+12%** higher conversion rates during afternoon hours.
- **Weekend Advantage**: Weekend sales consistently outperform weekdays by **34%**, suggesting strong consumer engagement during leisure time.

## Business Recommendations
- **Capitalize on Peak Hours**: Focus marketing efforts and sales team availability during **2-4 PM** to maximize conversion opportunities.
- **Weekend Strategy**: Consider expanding weekend marketing campaigns and ensuring adequate support coverage during weekends.
- **Enterprise Focus**: Given the strong performance of the Enterprise Plan, consider developing additional premium features or expanding enterprise sales efforts.
- **Customer Growth**: Maintain the momentum in customer acquisition by analyzing what's driving the **+18%** growth and scaling successful strategies.

## Next Steps
- **Follow-Up Questions**:
  - What specific marketing channels are driving the new customer acquisition?
  - How does customer lifetime value compare across different acquisition periods?
  
- **Related Analyses**:
  - Analyze customer retention rates to ensure new customers are staying engaged.
  - Examine seasonal trends to predict future performance patterns.

- **Data Exploration Recommendations**:
  - Deep dive into customer demographics to understand your most valuable segments.
  - Investigate the factors contributing to weekend sales success for potential weekday optimization.

Your sales performance shows excellent momentum with strong growth across multiple key metrics!""",
        
        "sql_query": """SELECT 
    DATE_TRUNC('month', last_order_date::date) AS month,
    SUM(revenue) AS total_revenue,
    COUNT(DISTINCT customer_id) AS new_customers,
    AVG(revenue) AS avg_revenue_per_customer
FROM 
    sales_precise_test.sales_precise_test_data
WHERE 
    last_order_date::date >= CURRENT_DATE - INTERVAL '6 months'
GROUP BY 
    month
ORDER BY 
    month DESC;""",
        
        "query_results": {
            "columns": ["month", "total_revenue", "new_customers", "avg_revenue_per_customer"],
            "data": [
                {
                    "month": "2024-12-01",
                    "total_revenue": 847000.0,
                    "new_customers": 47,
                    "avg_revenue_per_customer": 18021.28
                }
            ],
            "row_count": 1
        }
    },
    
    "billing-data-analysis": {
        "ai_response": """Here's what I found regarding your billing patterns, payment trends, and financial health analysis.

## Key Insights
- **Cash Flow Performance**: Your cash flow shows **$2.1M** with a strong **+15%** growth trend, indicating healthy financial momentum.
- **Payment Efficiency**: Average payment speed has improved to **12 days**, showing **-4 days** faster processing compared to previous periods.
- **Collection Success**: You've achieved an impressive **96.2%** collection rate, representing a **+1.8%** improvement in payment collection efficiency.
- **Payment Timing Patterns**: **End of Month** payments show **+8%** higher activity, suggesting customers align payments with their billing cycles.
- **Risk Management**: Overdue risk has decreased to **3.8%**, showing **-1.2%** improvement in payment reliability.

## Business Recommendations
- **Optimize End-of-Month Processing**: Given the **+8%** spike in end-of-month payments, ensure adequate processing capacity and customer support during these peak periods.
- **Maintain Collection Excellence**: Your **96.2%** collection rate is outstanding - continue current collection strategies while monitoring for any emerging trends.
- **Payment Speed Optimization**: The **12-day** average payment speed is excellent - consider implementing automated payment reminders to maintain this efficiency.
- **Risk Monitoring**: With overdue risk at only **3.8%**, maintain current credit policies while staying vigilant for any changes in customer payment behavior.

## Next Steps
- **Follow-Up Questions**:
  - What specific collection strategies are driving the improved collection rate?
  - Are there seasonal patterns in payment timing that could inform cash flow planning?
  
- **Related Analyses**:
  - Analyze payment method preferences to optimize the payment experience.
  - Examine customer segments to identify any payment behavior differences.

- **Data Exploration Recommendations**:
  - Investigate the factors contributing to faster payment processing.
  - Monitor trends in overdue accounts to proactively address potential issues.

Your billing and payment performance demonstrates excellent financial health with strong collection efficiency!""",
        
        "sql_query": """SELECT 
    COUNT(invoice_id) AS total_invoices,
    SUM(amount) AS total_amount,
    AVG(days_over_due) AS avg_payment_delay,
    COUNT(CASE WHEN payment_status = 'Paid' THEN 1 END) AS paid_invoices,
    COUNT(CASE WHEN payment_status = 'Overdue' THEN 1 END) AS overdue_invoices
FROM 
    billing_precise_test.billing_precise_test_data;""",
        
        "query_results": {
            "columns": ["total_invoices", "total_amount", "avg_payment_delay", "paid_invoices", "overdue_invoices"],
            "data": [
                {
                    "total_invoices": 100,
                    "total_amount": 2100000.0,
                    "avg_payment_delay": 12.0,
                    "paid_invoices": 96,
                    "overdue_invoices": 4
                }
            ],
            "row_count": 1
        }
    },
    
    "support-data-analysis": {
        "ai_response": """Here's what I found regarding your support ticket performance, response times, and resolution patterns analysis.

## Key Insights
- **Response Time Excellence**: Your average response time is **1.2 hours**, showing **-0.3h** improvement, indicating faster customer support delivery.
- **Customer Satisfaction**: Customers rate their experience at **4.8/5**, representing a **+0.3** improvement in satisfaction scores.
- **Ticket Volume**: You've handled **247 tickets** this month, showing **+12%** increase in support activity.
- **Peak Support Hours**: **10 AM - 2 PM** shows **+15%** higher ticket volume, indicating when customers most need assistance.
- **Common Issue Types**: **Account Access** issues represent the most frequent support request with **+8%** increase, suggesting potential UX optimization opportunities.

## Business Recommendations
- **Optimize Peak Hour Coverage**: With **+15%** higher ticket volume during **10 AM - 2 PM**, ensure adequate support staff coverage during these critical hours.
- **Address Account Access Issues**: The **+8%** increase in account access issues suggests reviewing your authentication and account management processes for potential improvements.
- **Maintain Response Excellence**: Your **1.2-hour** response time is excellent - continue current support processes while monitoring for any capacity constraints.
- **Leverage High Satisfaction**: With **4.8/5** satisfaction rating, consider gathering detailed feedback to identify best practices for maintaining this high standard.

## Next Steps
- **Follow-Up Questions**:
  - What specific improvements led to the faster response times?
  - Are there patterns in account access issues that could inform product improvements?
  
- **Related Analyses**:
  - Analyze resolution times by issue type to identify optimization opportunities.
  - Examine customer satisfaction trends to maintain high service quality.

- **Data Exploration Recommendations**:
  - Investigate the factors contributing to improved response times for replication.
  - Monitor ticket categorization accuracy to ensure proper issue tracking.

Your support performance shows excellent customer service with fast response times and high satisfaction!""",
        
        "sql_query": """SELECT 
    COUNT(ticket_id) AS total_tickets,
    AVG(response_time_hours) AS avg_response_time,
    AVG(satisfaction_rating) AS avg_satisfaction,
    COUNT(CASE WHEN priority = 'high' THEN 1 END) AS high_priority_tickets,
    COUNT(CASE WHEN status = 'resolved' THEN 1 END) AS resolved_tickets
FROM 
    support_precise_test.support_precise_test_data;""",
        
        "query_results": {
            "columns": ["total_tickets", "avg_response_time", "avg_satisfaction", "high_priority_tickets", "resolved_tickets"],
            "data": [
                {
                    "total_tickets": 247,
                    "avg_response_time": 1.2,
                    "avg_satisfaction": 4.8,
                    "high_priority_tickets": 15,
                    "resolved_tickets": 232
                }
            ],
            "row_count": 1
        }
    },
    
    "payment-insights": {
        "ai_response": """Here's what I found regarding your payment behavior and collection patterns analysis.

## Key Insights
- **Payment Method Distribution**: 
  - **Credit Card**: 45% of payments (most popular method)
  - **Bank Transfer**: 30% of payments (preferred by enterprise customers)
  - **PayPal**: 15% of payments (growing among small businesses)
  - **Check**: 10% of payments (declining trend)
- **Payment Timing Patterns**: 
  - **Early Payments**: 35% of customers pay 5+ days early
  - **On-Time Payments**: 48% pay within the due date window
  - **Late Payments**: 17% pay after due date (down from 22% last quarter)
- **Collection Efficiency**: 
  - **Average Collection Period**: 18 days (improved from 22 days)
  - **Collection Success Rate**: 94% (up from 91% last quarter)
  - **Dispute Rate**: 2.3% (industry average is 4.1%)

## Business Recommendations
- **Promote Preferred Payment Methods**: Consider offering incentives for credit card payments to reduce processing time and improve cash flow.
- **Early Payment Incentives**: Implement discounts for early payments to encourage the 35% who already pay early and attract more customers to this behavior.
- **Automated Payment Reminders**: Set up automated reminders 3 days before due date to reduce the 17% late payment rate.
- **Payment Method Optimization**: Analyze customer segments to recommend the most effective payment method for each customer type.

## Next Steps
- **Follow-Up Questions**:
  - What factors influence customers' choice of payment methods?
  - Are there seasonal patterns in payment behavior we should account for?
  
- **Related Analyses**:
  - Analyze payment method preferences by customer segment and industry.
  - Examine the correlation between payment method and customer satisfaction.

- **Data Exploration Recommendations**:
  - Investigate the impact of payment method on customer lifetime value.
  - Monitor trends in payment disputes and resolution times.

Your payment insights show strong collection performance with opportunities for further optimization!""",
        
        "sql_query": """SELECT 
    payment_method,
    COUNT(*) AS payment_count,
    AVG(days_over_due) AS avg_days_overdue,
    COUNT(CASE WHEN payment_status = 'Paid' THEN 1 END) AS successful_payments,
    COUNT(CASE WHEN payment_status = 'Disputed' THEN 1 END) AS disputed_payments
FROM 
    billing_precise_test.billing_precise_test_data
GROUP BY 
    payment_method
ORDER BY 
    payment_count DESC;""",
        
        "query_results": {
            "columns": ["payment_method", "payment_count", "avg_days_overdue", "successful_payments", "disputed_payments"],
            "data": [
                {
                    "payment_method": "Credit Card",
                    "payment_count": 45,
                    "avg_days_overdue": -2.1,
                    "successful_payments": 44,
                    "disputed_payments": 1
                },
                {
                    "payment_method": "Bank Transfer",
                    "payment_count": 30,
                    "avg_days_overdue": 1.5,
                    "successful_payments": 29,
                    "disputed_payments": 1
                },
                {
                    "payment_method": "PayPal",
                    "payment_count": 15,
                    "avg_days_overdue": 0.8,
                    "successful_payments": 15,
                    "disputed_payments": 0
                },
                {
                    "payment_method": "Check",
                    "payment_count": 10,
                    "avg_days_overdue": 5.2,
                    "successful_payments": 8,
                    "disputed_payments": 2
                }
            ],
            "row_count": 4
        }
    },
    
    "financial-optimization": {
        "ai_response": """Here's what I found regarding your financial optimization opportunities to improve cash flow and reduce risk.

## Key Insights
- **Cash Flow Optimization Potential**: 
  - **Working Capital**: Current ratio of 2.1 indicates healthy liquidity
  - **Cash Conversion Cycle**: 28 days (industry benchmark: 35 days) - excellent performance
  - **Revenue Recognition**: 95% of revenue recognized within 30 days
- **Risk Management Metrics**:
  - **Credit Risk**: 3.2% of customers have payment delays >30 days
  - **Concentration Risk**: Top 5 customers represent 28% of revenue (acceptable level)
  - **Currency Risk**: 15% of revenue in foreign currencies (hedged)
- **Cost Optimization Opportunities**:
  - **Payment Processing**: 2.9% average fee (can be reduced to 2.4% with volume discounts)
  - **Collection Costs**: $12K monthly (opportunity to automate and reduce by 40%)
  - **Bad Debt**: 0.8% write-off rate (industry average: 1.5%) - excellent

## Business Recommendations
- **Implement Dynamic Discounting**: Offer 1-2% discounts for payments within 10 days to improve cash flow velocity.
- **Automate Collections**: Implement automated payment reminders and escalation to reduce collection costs by $4.8K monthly.
- **Negotiate Payment Terms**: Extend payment terms with reliable customers to improve working capital efficiency.
- **Risk-Based Pricing**: Adjust credit terms based on customer risk profiles to minimize bad debt exposure.

## Next Steps
- **Follow-Up Questions**:
  - What is our optimal cash reserve level given current market conditions?
  - How can we better predict customer payment behavior to optimize credit terms?
  
- **Related Analyses**:
  - Conduct scenario analysis for different economic conditions.
  - Analyze the impact of payment term changes on customer satisfaction.

- **Data Exploration Recommendations**:
  - Model cash flow projections under various growth scenarios.
  - Evaluate the ROI of implementing automated collection systems.

Your financial optimization analysis reveals strong fundamentals with clear opportunities for improvement!""",
        
        "sql_query": """SELECT 
    AVG(amount) AS avg_invoice_amount,
    AVG(days_over_due) AS avg_payment_delay,
    COUNT(CASE WHEN payment_status = 'Paid' THEN 1 END) AS paid_invoices,
    COUNT(CASE WHEN payment_status = 'Overdue' THEN 1 END) AS overdue_invoices,
    COUNT(CASE WHEN payment_status = 'Disputed' THEN 1 END) AS disputed_invoices,
    SUM(amount) AS total_revenue
FROM 
    billing_precise_test.billing_precise_test_data;""",
        
        "query_results": {
            "columns": ["avg_invoice_amount", "avg_payment_delay", "paid_invoices", "overdue_invoices", "disputed_invoices", "total_revenue"],
            "data": [
                {
                    "avg_invoice_amount": 21000.0,
                    "avg_payment_delay": 2.1,
                    "paid_invoices": 96,
                    "overdue_invoices": 3,
                    "disputed_invoices": 1,
                    "total_revenue": 2100000.0
                }
            ],
            "row_count": 1
        }
    }
}

def get_mock_response(message: str) -> Dict[str, Any]:
    """Get response based on message content"""
    message_lower = message.lower()
    
    # Data table specific templates (check first for more specific matches)
    if "sales data analysis" in message_lower or ("sales" in message_lower and "performance trends" in message_lower):
        response = MOCK_RESPONSES["sales-data-analysis"].copy()
        response["response_type"] = "sales-data-analysis"
        return response
    elif "billing data analysis" in message_lower or ("billing" in message_lower and "payment trends" in message_lower):
        response = MOCK_RESPONSES["billing-data-analysis"].copy()
        response["response_type"] = "billing-data-analysis"
        return response
    elif "support data analysis" in message_lower or ("support" in message_lower and "response times" in message_lower):
        response = MOCK_RESPONSES["support-data-analysis"].copy()
        response["response_type"] = "support-data-analysis"
        return response
    elif "payment insights" in message_lower or ("payment" in message_lower and "behavior" in message_lower):
        response = MOCK_RESPONSES["payment-insights"].copy()
        response["response_type"] = "payment-insights"
        return response
    elif "financial optimization" in message_lower or ("opportunities" in message_lower and "cash flow" in message_lower and "reduce risk" in message_lower):
        response = MOCK_RESPONSES["financial-optimization"].copy()
        response["response_type"] = "financial-optimization"
        return response
    
    # Original dashboard templates
    elif "top" in message_lower and "customer" in message_lower:
        response = MOCK_RESPONSES["top-customers"].copy()
        response["response_type"] = "top-customers"
        return response
    elif "revenue" in message_lower and "trend" in message_lower:
        response = MOCK_RESPONSES["revenue-trends"].copy()
        response["response_type"] = "revenue-trends"
        return response
    elif "satisfaction" in message_lower or ("customer" in message_lower and "feedback" in message_lower):
        response = MOCK_RESPONSES["customer-satisfaction"].copy()
        response["response_type"] = "customer-satisfaction"
        return response
    elif "sales" in message_lower and "performance" in message_lower:
        response = MOCK_RESPONSES["sales-performance"].copy()
        response["response_type"] = "sales-performance"
        return response
    elif "inventory" in message_lower or "stock" in message_lower:
        response = MOCK_RESPONSES["inventory-analysis"].copy()
        response["response_type"] = "inventory-analysis"
        return response
    else:
        # Default response for unmatched queries
        response = MOCK_RESPONSES["top-customers"].copy()
        response["response_type"] = "top-customers"
        return response
