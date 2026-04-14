export interface TableInsight {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  description: string;
  sparkline: number[];
  type: 'insight' | 'pattern' | 'template';
}

export interface TableInsightsData {
  [tableName: string]: {
    insights: TableInsight[];
    patterns: TableInsight[];
    templates: TableInsight[];
  };
}

export const mockTableInsights: TableInsightsData = {
  'sales_data': {
    insights: [
      {
        id: 'sales-insight-1',
        title: 'Revenue Growth',
        value: '$2.4M',
        change: '+12.5%',
        changeType: 'positive',
        description: 'Monthly revenue shows consistent growth with Q4 peak performance driven by holiday sales and new product launches.',
        sparkline: [180, 195, 210, 240, 220, 250, 280, 275, 290, 310, 295, 320],
        type: 'insight'
      },
     
    ],
    patterns: [
      {
        id: 'sales-pattern-1',
        title: 'Seasonal Trend',
        value: 'Q4 Peak',
        change: '+45%',
        changeType: 'positive',
        description: 'Clear seasonal pattern with 45% increase in Q4, indicating strong holiday shopping behavior and year-end promotions.',
        sparkline: [100, 105, 110, 95, 90, 85, 80, 85, 90, 95, 120, 145],
        type: 'pattern'
      },
      
    ],
    templates: [
      {
        id: 'sales-template-1',
        title: 'Revenue Analysis',
        value: 'Query',
        change: 'Ready',
        changeType: 'neutral',
        description: 'Analyze revenue trends, top-performing products, and seasonal patterns to identify growth opportunities.',
        sparkline: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        type: 'template'
      },
     
    ]
  },
  'customers_data': {
    insights: [
      {
        id: 'customers-insight-1',
        title: 'Active Users',
        value: '12.5K',
        change: '+8.2%',
        changeType: 'positive',
        description: 'Active customer base growing steadily with 8.2% monthly increase, indicating strong product-market fit.',
        sparkline: [8500, 9200, 9800, 10500, 11200, 11800, 12000, 12100, 12200, 12300, 12400, 12500],
        type: 'insight'
      },
      {
        id: 'customers-insight-2',
        title: 'Retention Rate',
        value: '87%',
        change: '+3.1%',
        changeType: 'positive',
        description: 'High customer retention at 87% shows strong satisfaction and loyalty, with 3.1% improvement this quarter.',
        sparkline: [82, 83, 84, 85, 86, 85, 86, 87, 86, 87, 88, 87],
        type: 'insight'
      }
    ],
    patterns: [
      {
        id: 'customers-pattern-1',
        title: 'Geographic Spread',
        value: 'Global',
        change: '+15%',
        changeType: 'positive',
        description: 'Customer base expanding globally with 15% growth in international markets, showing successful market penetration.',
        sparkline: [60, 62, 65, 68, 70, 72, 75, 78, 80, 82, 85, 87],
        type: 'pattern'
      },
      {
        id: 'customers-pattern-2',
        title: 'Mobile Usage',
        value: '78%',
        change: '+12%',
        changeType: 'positive',
        description: 'Mobile-first customer behavior with 78% using mobile devices, indicating need for mobile-optimized experiences.',
        sparkline: [65, 67, 69, 71, 73, 75, 76, 77, 78, 78, 79, 78],
        type: 'pattern'
      }
    ],
    templates: [
      {
        id: 'customers-template-1',
        title: 'Segmentation',
        value: 'Query',
        change: 'Ready',
        changeType: 'neutral',
        description: 'Segment customers by behavior, demographics, and value to create targeted marketing campaigns.',
        sparkline: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        type: 'template'
      },
      {
        id: 'customers-template-2',
        title: 'Churn Analysis',
        value: 'Query',
        change: 'Ready',
        changeType: 'neutral',
        description: 'Identify at-risk customers and churn patterns to implement retention strategies and reduce customer loss.',
        sparkline: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        type: 'template'
      }
    ]
  },
  'orders_data': {
    insights: [
      {
        id: 'orders-insight-1',
        title: 'Order Volume',
        value: '8.2K',
        change: '+18.3%',
        changeType: 'positive',
        description: 'Order volume increased 18.3% this month, driven by successful marketing campaigns and product launches.',
        sparkline: [4500, 4800, 5200, 5500, 5800, 6200, 6500, 6800, 7200, 7500, 7800, 8200],
        type: 'insight'
      },
      {
        id: 'orders-insight-2',
        title: 'Avg Order Value',
        value: '$127',
        change: '+5.7%',
        changeType: 'positive',
        description: 'Average order value growing steadily at $127, indicating successful upselling and premium product adoption.',
        sparkline: [115, 118, 120, 122, 125, 123, 126, 128, 125, 127, 129, 127],
        type: 'insight'
      }
    ],
    patterns: [
      {
        id: 'orders-pattern-1',
        title: 'Peak Hours',
        value: '2-4 PM',
        change: '+22%',
        changeType: 'positive',
        description: 'Peak ordering hours between 2-4 PM with 22% higher volume, suggesting lunch break shopping behavior.',
        sparkline: [60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115],
        type: 'pattern'
      },
      {
        id: 'orders-pattern-2',
        title: 'Express Orders',
        value: '34%',
        change: '+8%',
        changeType: 'positive',
        description: '34% of orders are express delivery, showing customer preference for speed and convenience.',
        sparkline: [25, 27, 29, 31, 32, 33, 34, 34, 35, 34, 35, 34],
        type: 'pattern'
      }
    ],
    templates: [
      {
        id: 'orders-template-1',
        title: 'Order Analysis',
        value: 'Query',
        change: 'Ready',
        changeType: 'neutral',
        description: 'Analyze order patterns, fulfillment efficiency, and customer satisfaction to optimize operations.',
        sparkline: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        type: 'template'
      },
      {
        id: 'orders-template-2',
        title: 'Inventory Impact',
        value: 'Query',
        change: 'Ready',
        changeType: 'neutral',
        description: 'Correlate order patterns with inventory levels to optimize stock management and reduce stockouts.',
        sparkline: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        type: 'template'
      }
    ]
  }
};
