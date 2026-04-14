export interface ChatTemplate {
  id: string;
  title: string;
  description: string;
  message: string;
}

export const chatTemplates: ChatTemplate[] = [
  {
    id: 'top-customers',
    title: 'Top Customers Analysis',
    description: 'Identify your highest revenue customers',
    message: 'Show me the top 5 customers by revenue and analyze their performance'
  },
  {
    id: 'revenue-trends',
    title: 'Revenue Trends',
    description: 'Analyze revenue patterns over time',
    message: 'What are the revenue trends by month for the last 6 months?'
  },
  {
    id: 'support-analysis',
    title: 'Support Ticket Analysis',
    description: 'Analyze customer support performance',
    message: 'Analyze our support ticket performance and customer satisfaction'
  },
  {
    id: 'billing-insights',
    title: 'Billing & Payment Insights',
    description: 'Analyze payment patterns and overdue accounts',
    message: 'Show me billing insights including overdue payments and payment methods'
  },
  {
    id: 'customer-segmentation',
    title: 'Customer Segmentation',
    description: 'Segment customers by value and behavior',
    message: 'Segment our customers by subscription tier and analyze their characteristics'
  }
];
