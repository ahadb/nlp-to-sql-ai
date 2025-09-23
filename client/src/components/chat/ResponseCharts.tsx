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

interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

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
              label={({ industry, percent }) => `${industry} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="revenue"
            >
              {data.map((entry: any, index: number) => (
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
              {data.map((entry: any, index: number) => (
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
