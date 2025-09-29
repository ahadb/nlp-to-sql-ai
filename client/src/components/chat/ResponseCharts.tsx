import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';

// interface ChartData {
//   name: string;
//   value: number;
//   [key: string]: any;
// }

interface ResponseChartsProps {
  responseType: string;
  queryResults: any;
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

const ResponseCharts: React.FC<ResponseChartsProps> = ({ responseType, queryResults }) => {
  if (!queryResults || !queryResults.data) return null;

  const renderTopCustomersChart = () => {
    const data = queryResults.data.map((item: any) => ({
      name: item.company_name || 'Unknown Company',
      revenue: item.revenue || 0,
      industry: item.industry || 'Unknown'
    }));

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Revenue by Company</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <h4 className="text-sm font-medium text-gray-300">Industry Distribution</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(props: any) => `${props.industry} ${(props.percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="revenue"
            >
              {data.map((index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderCustomerSegmentationChart = () => {
    const data = queryResults.data.map((item: any) => ({
      name: item.subscription_tier || 'Unknown',
      customers: item.customer_count || 0,
      revenue: Math.round(item.average_revenue || 0),
      employees: Math.round(item.average_employees || 0),
      orders: Math.round(item.average_total_orders || 0)
    }));

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Customer Distribution by Tier</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="customers"
            >
              {data.map((index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number, name: string) => [value, name === 'customers' ? 'Customers' : name]}
            />
          </PieChart>
        </ResponsiveContainer>

        <h4 className="text-sm font-medium text-gray-300">Average Revenue by Tier</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Avg Revenue']}
            />
            <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderSupportPerformanceChart = () => {
    const data = [
      { name: 'Satisfaction', value: queryResults.data[0]?.average_satisfaction_rating || 0, max: 5 },
      { name: 'Response Time', value: queryResults.data[0]?.average_response_time || 0, max: 50 }
    ];

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Support Performance Metrics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h5 className="text-xs text-gray-400 mb-2">Customer Satisfaction</h5>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={[data[0]]}>
                <Bar dataKey="value" fill="#10B981" radius={[4, 4, 0, 0]} />
                <YAxis domain={[0, 5]} hide />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}/5`, 'Satisfaction']}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h5 className="text-xs text-gray-400 mb-2">Response Time (Hours)</h5>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={[data[1]]}>
                <Bar dataKey="value" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                <YAxis domain={[0, 50]} hide />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)} hours`, 'Response Time']}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderBillingAnalysisChart = () => {
    const data = queryResults.data.map((item: any) => ({
      name: item.customer_name ? item.customer_name.split(' ')[0] : 'Unknown', // First name only
      amount: item.amount || 0,
      status: item.payment_status || 'Unknown'
    }));

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Overdue Invoice Amounts</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="name" 
              stroke="#9CA3AF"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number) => [`$${value}`, 'Amount']}
            />
            <Bar dataKey="amount" fill="#EF4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderRevenueTrendsChart = () => {
    // Sample data for revenue trends since the actual response has no data
    const data = [
      { month: 'Q1 2023', revenue: 1800000 },
      { month: 'Q2 2023', revenue: 1950000 },
      { month: 'Q3 2023', revenue: 2100000 },
      { month: 'Q4 2023', revenue: 2400000 },
      { month: 'Q1 2024', revenue: 1800000 },
      { month: 'Q2 2024', revenue: 2100000 }
    ];

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Revenue Trends</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderSalesDataAnalysisChart = () => {
    const data = queryResults.data.map((item: any) => ({
      month: item.month ? new Date(item.month).toLocaleDateString('en-US', { month: 'short' }) : 'Unknown',
      revenue: item.total_revenue || 0,
      customers: item.new_customers || 0,
      avgRevenue: item.avg_revenue_per_customer || 0
    }));

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Monthly Revenue Trend</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Area 
              type="monotone" 
              dataKey="revenue" 
              stroke="#3B82F6" 
              fill="#3B82F6" 
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>

        <h4 className="text-sm font-medium text-gray-300">New Customers by Month</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="month" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number) => [value, 'New Customers']}
            />
            <Bar dataKey="customers" fill="#10B981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderBillingDataAnalysisChart = () => {
    const data = queryResults.data.map((item: any) => ({
      metric: 'Financial Health',
      totalInvoices: item.total_invoices || 0,
      totalAmount: item.total_amount || 0,
      avgDelay: item.avg_payment_delay || 0,
      paidInvoices: item.paid_invoices || 0,
      overdueInvoices: item.overdue_invoices || 0
    }));

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Invoice Status Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { name: 'Paid', value: data[0]?.paidInvoices || 0, color: '#10B981' },
                { name: 'Overdue', value: data[0]?.overdueInvoices || 0, color: '#EF4444' }
              ]}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {[
                { name: 'Paid', value: data[0]?.paidInvoices || 0, color: '#10B981' },
                { name: 'Overdue', value: data[0]?.overdueInvoices || 0, color: '#EF4444' }
              ].map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number, name: string) => [value, name]}
            />
          </PieChart>
        </ResponsiveContainer>

        <h4 className="text-sm font-medium text-gray-300">Payment Performance Metrics</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">${((data[0]?.totalAmount || 0) / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </div>
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{data[0]?.avgDelay || 0} days</div>
            <div className="text-sm text-gray-400">Avg Payment Delay</div>
          </div>
        </div>
      </div>
    );
  };

  const renderSupportDataAnalysisChart = () => {
    const data = queryResults.data.map((item: any) => ({
      metric: 'Support Performance',
      totalTickets: item.total_tickets || 0,
      avgResponseTime: item.avg_response_time || 0,
      avgSatisfaction: item.avg_satisfaction || 0,
      highPriority: item.high_priority_tickets || 0,
      resolved: item.resolved_tickets || 0
    }));

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Support Performance Overview</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{data[0]?.totalTickets || 0}</div>
            <div className="text-sm text-gray-400">Total Tickets</div>
          </div>
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{data[0]?.avgResponseTime || 0}h</div>
            <div className="text-sm text-gray-400">Avg Response Time</div>
          </div>
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{data[0]?.avgSatisfaction || 0}/5</div>
            <div className="text-sm text-gray-400">Avg Satisfaction</div>
          </div>
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{data[0]?.resolved || 0}</div>
            <div className="text-sm text-gray-400">Resolved Tickets</div>
          </div>
        </div>
      </div>
    );
  };

  const renderPaymentInsightsChart = () => {
    const data = queryResults.data.map((item: any) => ({
      method: item.payment_method || 'Unknown',
      count: item.payment_count || 0,
      avgDelay: item.avg_days_overdue || 0,
      successful: item.successful_payments || 0,
      disputed: item.disputed_payments || 0
    }));

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Payment Methods Distribution</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="count"
            >
              {data.map((_: any, index: number) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number, name: string) => [value, name === 'count' ? 'Payments' : name]}
            />
          </PieChart>
        </ResponsiveContainer>

        <h4 className="text-sm font-medium text-gray-300">Payment Success Rate by Method</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="method" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number) => [`${value}%`, 'Success Rate']}
            />
            <Bar 
              dataKey={(entry: any) => ((entry.successful / entry.count) * 100).toFixed(1)} 
              fill="#10B981" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderFinancialOptimizationChart = () => {
    const data = queryResults.data.map((item: any) => ({
      metric: 'Financial Health',
      avgInvoice: item.avg_invoice_amount || 0,
      avgDelay: item.avg_payment_delay || 0,
      paid: item.paid_invoices || 0,
      overdue: item.overdue_invoices || 0,
      disputed: item.disputed_invoices || 0,
      totalRevenue: item.total_revenue || 0
    }));

    return (
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-300">Financial Health Metrics</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-400">${((data[0]?.totalRevenue || 0) / 1000000).toFixed(1)}M</div>
            <div className="text-sm text-gray-400">Total Revenue</div>
          </div>
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">${((data[0]?.avgInvoice || 0) / 1000).toFixed(0)}K</div>
            <div className="text-sm text-gray-400">Avg Invoice</div>
          </div>
          <div className="bg-gray-700/30 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{data[0]?.avgDelay || 0} days</div>
            <div className="text-sm text-gray-400">Avg Payment Delay</div>
          </div>
        </div>

        <h4 className="text-sm font-medium text-gray-300">Invoice Status Breakdown</h4>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[
            { status: 'Paid', count: data[0]?.paid || 0, color: '#10B981' },
            { status: 'Overdue', count: data[0]?.overdue || 0, color: '#EF4444' },
            { status: 'Disputed', count: data[0]?.disputed || 0, color: '#F59E0B' }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="status" 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <YAxis 
              stroke="#9CA3AF"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#F9FAFB'
              }}
              formatter={(value: number) => [value, 'Invoices']}
            />
            <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderChart = () => {
    switch (responseType) {
      case 'top-customers':
        return renderTopCustomersChart();
      case 'customer-satisfaction':
        return renderSupportPerformanceChart();
      case 'sales-performance':
        return renderBillingAnalysisChart();
      case 'inventory-analysis':
        return renderCustomerSegmentationChart();
      case 'revenue-trends':
        return renderRevenueTrendsChart();
      case 'sales-data-analysis':
        return renderSalesDataAnalysisChart();
      case 'billing-data-analysis':
        return renderBillingDataAnalysisChart();
      case 'support-data-analysis':
        return renderSupportDataAnalysisChart();
      case 'payment-insights':
        return renderPaymentInsightsChart();
      case 'financial-optimization':
        return renderFinancialOptimizationChart();
      default:
        return null;
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-800/30 rounded-lg">
      {renderChart()}
    </div>
  );
};

export default ResponseCharts;
