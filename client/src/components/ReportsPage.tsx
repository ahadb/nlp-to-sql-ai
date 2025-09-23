import React, { useState, useEffect } from "react";
import { Sidebar, MobileSidebar, TopBar, Layout, AIChatDrawer } from "./index";
import {
  ChartBarIcon,
  DocumentTextIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyDollarIcon,

  EyeIcon,
  PencilIcon,
  TrashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SparklesIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ReportsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeReportTab, setActiveReportTab] = useState<'overview' | 'scheduled'>('overview');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [hasData, setHasData] = useState(false);

  // Fetch data sources to determine if we have data
  useEffect(() => {
    const fetchDataSources = async () => {
      try {
        const response = await fetch('http://localhost:8000/upload/schemas');
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched schemas data:', data);
          // The API returns { status, schemas, count }
          const schemas = data.schemas || [];
          setDataSources(schemas);
          // Check if we have any schemas with data
          const hasAnyData = Array.isArray(schemas) && schemas.length > 0;
          console.log('Has data:', hasAnyData, 'Schema count:', schemas.length);
          setHasData(hasAnyData);
        } else {
          console.log('Response not ok:', response.status);
          setHasData(false);
        }
      } catch (error) {
        console.error('Error fetching data sources:', error);
        setHasData(false);
      }
    };

    fetchDataSources();
  }, []);

  // Dynamic executive metrics based on data availability
  console.log('Rendering metrics with hasData:', hasData);
  const executiveMetrics = hasData ? [
    { 
      title: "Monthly Revenue", 
      value: "$847K", 
      change: "+23.5%", 
      trend: "up", 
      icon: CurrencyDollarIcon,
      sparklineData: [420, 445, 380, 510, 680, 720, 847],
      color: "emerald"
    },
    { 
      title: "Active Customers", 
      value: "2,847", 
      change: "+12.8%", 
      trend: "up", 
      icon: UserGroupIcon,
      sparklineData: [2100, 2200, 2150, 2400, 2600, 2750, 2847],
      color: "blue"
    },
    { 
      title: "Data Quality Score", 
      value: "94.2%", 
      change: "+2.1%", 
      trend: "up", 
      icon: ChartBarIcon,
      sparklineData: [89, 90, 88, 92, 93, 94, 94.2],
      color: "purple"
    },
    { 
      title: "Report Usage", 
      value: "1,247", 
      change: "+45.7%", 
      trend: "up", 
      icon: DocumentTextIcon,
      sparklineData: [650, 720, 890, 980, 1100, 1180, 1247],
      color: "cyan"
    },
  ] : [
    { 
      title: "Monthly Revenue", 
      value: "$0", 
      change: "0%", 
      trend: "neutral", 
      icon: CurrencyDollarIcon,
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      color: "emerald"
    },
    { 
      title: "Active Customers", 
      value: "0", 
      change: "0%", 
      trend: "neutral", 
      icon: UserGroupIcon,
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      color: "blue"
    },
    { 
      title: "Data Quality Score", 
      value: "0%", 
      change: "0%", 
      trend: "neutral", 
      icon: ChartBarIcon,
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      color: "purple"
    },
    { 
      title: "Report Usage", 
      value: "0", 
      change: "0%", 
      trend: "neutral", 
      icon: DocumentTextIcon,
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      color: "cyan"
    },
  ];

  const scheduledReports = hasData ? [
    { id: 1, name: "Daily Sales Summary", type: "Sales", frequency: "Daily", lastRun: "Dec 15, 2024", nextRun: "Dec 16, 2024", status: "Active", recipients: 5, size: "1.2 MB" },
    { id: 2, name: "Weekly Customer Analysis", type: "Analytics", frequency: "Weekly", lastRun: "Dec 9, 2024", nextRun: "Dec 16, 2024", status: "Active", recipients: 3, size: "2.1 MB" },
    { id: 3, name: "Monthly Revenue Report", type: "Finance", frequency: "Monthly", lastRun: "Dec 1, 2024", nextRun: "Jan 1, 2025", status: "Active", recipients: 8, size: "1.8 MB" },
    { id: 4, name: "Quarterly Business Review", type: "Executive", frequency: "Quarterly", lastRun: "Oct 1, 2024", nextRun: "Jan 1, 2025", status: "Paused", recipients: 12, size: "3.4 MB" },
    { id: 5, name: "Support Ticket Trends", type: "Support", frequency: "Weekly", lastRun: "Dec 12, 2024", nextRun: "Dec 19, 2024", status: "Active", recipients: 4, size: "1.6 MB" },
    { id: 6, name: "Product Performance Weekly", type: "Operations", frequency: "Weekly", lastRun: "Dec 14, 2024", nextRun: "Dec 21, 2024", status: "Active", recipients: 6, size: "2.3 MB" },
  ] : [
    { id: 1, name: "No scheduled reports yet", type: "System", frequency: "-", lastRun: "-", nextRun: "-", status: "Pending", recipients: 0, size: "-" },
  ];


  // Dynamic chart data based on data availability
  const revenueData = hasData ? [
    { month: 'Jan', revenue: 180000, target: 200000, growth: 12.5 },
    { month: 'Feb', revenue: 195000, target: 210000, growth: 8.3 },
    { month: 'Mar', revenue: 220000, target: 220000, growth: 12.8 },
    { month: 'Apr', revenue: 245000, target: 230000, growth: 11.4 },
    { month: 'May', revenue: 210000, target: 240000, growth: -14.3 },
    { month: 'Jun', revenue: 280000, target: 250000, growth: 33.3 },
    { month: 'Jul', revenue: 295000, target: 260000, growth: 5.4 },
    { month: 'Aug', revenue: 310000, target: 270000, growth: 5.1 },
    { month: 'Sep', revenue: 285000, target: 280000, growth: -8.1 },
    { month: 'Oct', revenue: 320000, target: 290000, growth: 12.3 },
    { month: 'Nov', revenue: 340000, target: 300000, growth: 6.3 },
    { month: 'Dec', revenue: 365000, target: 310000, growth: 7.4 },
  ] : Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    revenue: 0,
    target: 0,
    growth: 0
  }));

  const customerGrowthData = hasData ? [
    { month: 'Jan', customers: 850, newCustomers: 45, churnRate: 2.1, satisfaction: 87 },
    { month: 'Feb', customers: 890, newCustomers: 52, churnRate: 1.8, satisfaction: 89 },
    { month: 'Mar', customers: 925, newCustomers: 48, churnRate: 2.3, satisfaction: 86 },
    { month: 'Apr', customers: 970, newCustomers: 65, churnRate: 1.5, satisfaction: 91 },
    { month: 'May', customers: 1010, newCustomers: 58, churnRate: 2.0, satisfaction: 88 },
    { month: 'Jun', customers: 1055, newCustomers: 72, churnRate: 1.2, satisfaction: 93 },
    { month: 'Jul', customers: 1100, newCustomers: 68, churnRate: 1.8, satisfaction: 90 },
    { month: 'Aug', customers: 1145, newCustomers: 75, churnRate: 1.4, satisfaction: 92 },
    { month: 'Sep', customers: 1180, newCustomers: 62, churnRate: 2.2, satisfaction: 85 },
    { month: 'Oct', customers: 1220, newCustomers: 80, churnRate: 1.3, satisfaction: 94 },
    { month: 'Nov', customers: 1265, newCustomers: 85, churnRate: 1.1, satisfaction: 95 },
    { month: 'Dec', customers: 1310, newCustomers: 78, churnRate: 1.6, satisfaction: 91 },
  ] : Array.from({ length: 12 }, (_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    customers: 0,
    newCustomers: 0,
    churnRate: 0,
    satisfaction: 0
  }));

  // Enhanced custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      
      return (
        <div className="bg-gray-900/95 border border-gray-600/50 rounded-xl p-4 shadow-xl backdrop-blur-sm">
          <p className="text-white font-semibold text-sm mb-2">{`${label} 2024`}</p>
          
          {/* Revenue Chart Tooltip */}
          {data?.revenue !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-blue-400 text-sm">Revenue:</span>
                <span className="text-white font-medium">${(data.revenue / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Target:</span>
                <span className="text-gray-300">${(data.target / 1000).toFixed(0)}K</span>
              </div>
              {data.growth !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Growth:</span>
                  <span className={`font-medium ${data.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {data.growth >= 0 ? '+' : ''}{data.growth.toFixed(1)}%
                  </span>
                </div>
              )}
              <div className="pt-1 border-t border-gray-700/50">
                <span className="text-xs text-gray-500">
                  {data.revenue >= data.target ? '🎯 Target exceeded' : '⚠️ Below target'}
                </span>
              </div>
            </div>
          )}
          
          {/* Customer Chart Tooltip */}
          {data?.customers !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 text-sm">Total Customers:</span>
                <span className="text-white font-medium">{data.customers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-400 text-sm">New Customers:</span>
                <span className="text-white font-medium">{data.newCustomers}</span>
              </div>
              {data.churnRate !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-orange-400 text-sm">Churn Rate:</span>
                  <span className="text-white">{data.churnRate}%</span>
                </div>
              )}
              {data.satisfaction !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-purple-400 text-sm">Satisfaction:</span>
                  <span className="text-white">{data.satisfaction}%</span>
                </div>
              )}
              <div className="pt-1 border-t border-gray-700/50">
                <span className="text-xs text-gray-500">
                  {data.churnRate <= 2.0 ? '✅ Healthy retention' : '⚠️ High churn risk'}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return (
        <div className="flex flex-col ml-1">
          <ChevronUpIcon className="h-2.5 w-2.5 text-gray-500" />
          <ChevronDownIcon className="h-2.5 w-2.5 text-gray-500 -mt-1" />
        </div>
      );
    }
    return sortDirection === 'asc' ? (
      <ChevronUpIcon className="h-3 w-3 text-blue-400 ml-1" />
    ) : (
      <ChevronDownIcon className="h-3 w-3 text-blue-400 ml-1" />
    );
  };

  return (
    <div className="bg-[#1a1a1a] min-h-screen relative">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <TopBar setSidebarOpen={setSidebarOpen} />
      <Layout
        leftChildren={
          <div>
            {/* Header */}
            <div className="pt-12 px-6 pb-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Reports & Analytics</h1>
                  <p className="text-gray-400">Generate insights and manage automated reports</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <button 
                      onClick={() => setIsActionsOpen(!isActionsOpen)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-600/50 text-gray-300 hover:text-white hover:border-gray-500 text-sm rounded-lg transition-colors duration-200"
                    >
                      <EllipsisVerticalIcon className="h-4 w-4" />
                      <span>Actions</span>
                      <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${isActionsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isActionsOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#262626] border border-gray-600/50 rounded-lg shadow-xl z-50">
                        <div className="py-2">
                          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200">
                            <PlusIcon className="h-4 w-4 text-gray-400" />
                            <span>New Report</span>
                          </button>
                          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200">
                            <CalendarIcon className="h-4 w-4 text-gray-400" />
                            <span>Schedule Report</span>
                          </button>
                          <div className="border-t border-gray-700/50 my-1"></div>
                          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200">
                            <ArrowDownTrayIcon className="h-4 w-4 text-gray-400" />
                            <span>Export All</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(true)}
                    className="border border-blue-500/50 text-blue-400 px-4 py-2 rounded-lg hover:border-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200 group flex items-center space-x-2"
                  >
                    <SparklesIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium text-sm">Ask AI</span>
                  </button>
                </div>
              </div>

              {/* Executive Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {executiveMetrics.map((metric, index) => (
                  <div key={index} className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-4 hover:border-gray-500/50 transition-all duration-300 relative">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{metric.value}</h3>
                        <p className="text-sm text-gray-400">{metric.title}</p>
                      </div>
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-emerald-400' : 
                        metric.trend === 'down' ? 'text-red-400' : 
                        'text-gray-400'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                    
                    {/* Sparkline */}
                    <div className="h-8 mt-2">
                      <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke={
                            metric.color === 'emerald' ? 'rgb(52 211 153)' :
                            metric.color === 'blue' ? 'rgb(59 130 246)' :
                            metric.color === 'purple' ? 'rgb(168 85 247)' :
                            'rgb(34 211 238)'
                          }
                          strokeWidth="2"
                          points={metric.sparklineData.map((value, i) => {
                            const x = (i / (metric.sparklineData.length - 1)) * 100;
                            const minVal = Math.min(...metric.sparklineData);
                            const maxVal = Math.max(...metric.sparklineData);
                            const y = 20 - ((value - minVal) / (maxVal - minVal)) * 16;
                            return `${x},${y}`;
                          }).join(' ')}
                        />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Last 7 periods</p>
                  </div>
                ))}
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center space-x-2">
                {[
                  { id: 'overview', label: 'Overview', icon: ChartBarIcon },
                  { id: 'scheduled', label: 'Scheduled', icon: ClockIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveReportTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 border rounded-lg ${
                      activeReportTab === tab.id
                        ? 'text-blue-400 border-blue-400 bg-blue-500/10'
                        : 'text-gray-400 border-gray-600/50 hover:text-gray-300 hover:border-gray-500/50 hover:bg-gray-700/20'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="pt-4 px-6 pb-6">
              {activeReportTab === 'overview' && (
                <div className="space-y-8">
                  {/* Interactive Charts Section */}
                  <div className={`grid gap-6 ${hasData ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 lg:grid-cols-2'}`}>
                    <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6 hover:border-gray-500/50 transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Revenue Performance</h3>
                          <p className="text-xs text-gray-400 mt-1">Monthly revenue vs targets with growth trends</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button 
                            className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200"
                            title="Export Chart"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-all duration-200"
                            title="Drill Down"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={revenueData}>
                            <defs>
                              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="month" 
                              stroke="#9ca3af" 
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis 
                              stroke="#9ca3af" 
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                              type="monotone"
                              dataKey="revenue"
                              stroke="#3b82f6"
                              strokeWidth={2}
                              fill="url(#revenueGradient)"
                              name="Revenue"
                            />
                            <Line
                              type="monotone"
                              dataKey="target"
                              stroke="#6b7280"
                              strokeWidth={2}
                              strokeDasharray="5 5"
                              name="Target"
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Legend */}
                      <div className="flex items-center justify-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1.5 text-xs">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-400">Revenue</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs">
                          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                          <span className="text-gray-400">Target</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6 hover:border-gray-500/50 transition-all duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Customer Analytics</h3>
                          <p className="text-xs text-gray-400 mt-1">Growth trends, retention, and satisfaction metrics</p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <button 
                            className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-all duration-200"
                            title="Export Chart"
                          >
                            <ArrowDownTrayIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-all duration-200"
                            title="Customer Segmentation"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={customerGrowthData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="month" 
                              stroke="#9ca3af" 
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <YAxis 
                              stroke="#9ca3af" 
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                              type="monotone"
                              dataKey="customers"
                              stroke="#10b981"
                              strokeWidth={3}
                              name="Total Customers"
                              dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
                            />
                            <Line
                              type="monotone"
                              dataKey="newCustomers"
                              stroke="#06b6d4"
                              strokeWidth={2}
                              name="New Customers"
                              dot={{ fill: '#06b6d4', strokeWidth: 2, r: 3 }}
                              activeDot={{ r: 5, stroke: '#06b6d4', strokeWidth: 2 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      {/* Legend */}
                      <div className="flex items-center justify-center space-x-4 mt-2">
                        <div className="flex items-center space-x-1.5 text-xs">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span className="text-gray-400">Total</span>
                        </div>
                        <div className="flex items-center space-x-1.5 text-xs">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                          <span className="text-gray-400">New</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Third Chart - Operations Performance (only when data exists) */}
                    {hasData && (
                      <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6 hover:border-gray-500/50 transition-all duration-200">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-white">Operations Insights</h3>
                            <p className="text-xs text-gray-400 mt-1">Support tickets, resolution time, and satisfaction</p>
                          </div>
                          <div className="flex items-center space-x-1">
                            <button 
                              className="p-1.5 text-gray-400 hover:text-orange-400 hover:bg-orange-500/10 rounded transition-all duration-200"
                              title="Export Chart"
                            >
                              <ArrowDownTrayIcon className="h-4 w-4" />
                            </button>
                            <button 
                              className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-all duration-200"
                              title="Support Analytics"
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        <div className="h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[
                              { month: 'Jan', tickets: 45, resolved: 42, avgTime: 2.3 },
                              { month: 'Feb', tickets: 52, resolved: 48, avgTime: 2.1 },
                              { month: 'Mar', tickets: 38, resolved: 35, avgTime: 2.8 },
                              { month: 'Apr', tickets: 41, resolved: 39, avgTime: 1.9 },
                              { month: 'May', tickets: 47, resolved: 44, avgTime: 2.2 },
                              { month: 'Jun', tickets: 35, resolved: 33, avgTime: 1.8 },
                              { month: 'Jul', tickets: 49, resolved: 46, avgTime: 2.0 },
                              { month: 'Aug', tickets: 43, resolved: 41, avgTime: 1.7 },
                              { month: 'Sep', tickets: 51, resolved: 47, avgTime: 2.4 },
                              { month: 'Oct', tickets: 39, resolved: 37, avgTime: 1.9 },
                              { month: 'Nov', tickets: 44, resolved: 42, avgTime: 2.1 },
                              { month: 'Dec', tickets: 48, resolved: 46, avgTime: 1.8 },
                            ]}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                              <XAxis 
                                dataKey="month" 
                                stroke="#9ca3af" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <YAxis 
                                stroke="#9ca3af" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                              />
                              <Tooltip content={<CustomTooltip />} />
                              <Bar
                                dataKey="tickets"
                                fill="#f97316"
                                name="Total Tickets"
                                radius={[2, 2, 0, 0]}
                              />
                              <Bar
                                dataKey="resolved"
                                fill="#a855f7"
                                name="Resolved"
                                radius={[2, 2, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        {/* Legend */}
                        <div className="flex items-center justify-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1.5 text-xs">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-400">Tickets</span>
                          </div>
                          <div className="flex items-center space-x-1.5 text-xs">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span className="text-gray-400">Resolved</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Recent Reports */}
                  <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl">
                    <div className="p-6 border-b border-gray-700/50">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
                        <button className="text-blue-400 hover:text-blue-300 text-sm">View All</button>
                      </div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-[#262626] border-b border-gray-600/30">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <button 
                                onClick={() => handleSort('name')} 
                                className="flex items-center hover:text-gray-300 transition-colors duration-200"
                              >
                                Report Name {getSortIcon('name')}
                              </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <button 
                                onClick={() => handleSort('type')} 
                                className="flex items-center hover:text-gray-300 transition-colors duration-200"
                              >
                                Type {getSortIcon('type')}
                              </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <button 
                                onClick={() => handleSort('generated')} 
                                className="flex items-center hover:text-gray-300 transition-colors duration-200"
                              >
                                Generated {getSortIcon('generated')}
                              </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <button 
                                onClick={() => handleSort('size')} 
                                className="flex items-center hover:text-gray-300 transition-colors duration-200"
                              >
                                Size {getSortIcon('size')}
                              </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                              <button 
                                onClick={() => handleSort('status')} 
                                className="flex items-center hover:text-gray-300 transition-colors duration-200"
                              >
                                Status {getSortIcon('status')}
                              </button>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                          {(hasData ? [
                            { name: "Sales Performance Dashboard", generated: "2 hours ago", type: "Sales", size: "3.2 MB", status: "Ready", priority: "high" },
                            { name: "Customer Retention Analysis", generated: "5 hours ago", type: "Analytics", size: "2.8 MB", status: "Ready", priority: "medium" },
                            { name: "Monthly Revenue Breakdown", generated: "1 day ago", type: "Finance", size: "1.9 MB", status: "Ready", priority: "high" },
                            { name: "Product Category Insights", generated: "1 day ago", type: "Operations", size: "4.1 MB", status: "Ready", priority: "medium" },
                            { name: "Support Ticket Trends", generated: "2 days ago", type: "Support", size: "2.3 MB", status: "Ready", priority: "low" },
                            { name: "Weekly Business Summary", generated: "3 days ago", type: "Executive", size: "1.7 MB", status: "Ready", priority: "high" },
                            { name: "Customer Satisfaction Survey", generated: "4 days ago", type: "Analytics", size: "2.1 MB", status: "Ready", priority: "medium" },
                            { name: "Inventory Management Report", generated: "5 days ago", type: "Operations", size: "3.5 MB", status: "Ready", priority: "low" },
                          ] : [
                            { name: "No reports generated yet", generated: "-", type: "System", size: "-", status: "Pending", priority: "low" },
                          ]).map((report, index) => (
                            <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-200">
                              <td className="px-6 py-4 text-sm text-white font-medium">{report.name}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                  report.type === 'Sales' ? 'bg-green-500/20 text-green-300' :
                                  report.type === 'Analytics' ? 'bg-blue-500/20 text-blue-300' :
                                  report.type === 'Finance' ? 'bg-yellow-500/20 text-yellow-300' :
                                  report.type === 'Operations' ? 'bg-purple-500/20 text-purple-300' :
                                  report.type === 'Support' ? 'bg-orange-500/20 text-orange-300' :
                                  report.type === 'Executive' ? 'bg-red-500/20 text-red-300' :
                                  'bg-gray-500/20 text-gray-300'
                                }`}>
                                  {report.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">{report.generated}</td>
                              <td className="px-6 py-4 text-sm text-gray-300">{report.size}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  report.status === 'Ready' ? 'bg-emerald-500/20 text-emerald-300' :
                                  report.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-300' :
                                  report.status === 'Failed' ? 'bg-red-500/20 text-red-300' :
                                  'bg-gray-500/20 text-gray-300'
                                }`}>
                                  <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                    report.status === 'Ready' ? 'bg-emerald-400' :
                                    report.status === 'Processing' ? 'bg-yellow-400' :
                                    report.status === 'Failed' ? 'bg-red-400' :
                                    'bg-gray-400'
                                  }`}></div>
                                  {report.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  {report.status === 'Ready' ? (
                                    <>
                                      <button 
                                        className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200"
                                        title="View Report"
                                      >
                                        <EyeIcon className="h-4 w-4" />
                                      </button>
                                      <button 
                                        className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-all duration-200"
                                        title="Download Report"
                                      >
                                        <ArrowDownTrayIcon className="h-4 w-4" />
                                      </button>
                                      <button 
                                        className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-all duration-200"
                                        title="Share Report"
                                      >
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                        </svg>
                                      </button>
                                      <button 
                                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200"
                                        title="Delete Report"
                                      >
                                        <TrashIcon className="h-4 w-4" />
                                      </button>
                                    </>
                                  ) : (
                                    <span className="text-xs text-gray-500">
                                      {report.status === 'Pending' ? 'Upload data to generate reports' : 'Processing...'}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeReportTab === 'scheduled' && (
                <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl">
                  <div className="p-6 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white">Scheduled Reports</h3>
                    <p className="text-gray-400 text-sm mt-1">Manage automated report generation and delivery</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#262626] border-b border-gray-600/30">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            <button 
                              onClick={() => handleSort('name')} 
                              className="flex items-center hover:text-gray-300 transition-colors duration-200"
                            >
                              Report Name {getSortIcon('name')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            <button 
                              onClick={() => handleSort('type')} 
                              className="flex items-center hover:text-gray-300 transition-colors duration-200"
                            >
                              Type {getSortIcon('type')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            <button 
                              onClick={() => handleSort('frequency')} 
                              className="flex items-center hover:text-gray-300 transition-colors duration-200"
                            >
                              Frequency {getSortIcon('frequency')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            <button 
                              onClick={() => handleSort('nextRun')} 
                              className="flex items-center hover:text-gray-300 transition-colors duration-200"
                            >
                              Next Run {getSortIcon('nextRun')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            <button 
                              onClick={() => handleSort('size')} 
                              className="flex items-center hover:text-gray-300 transition-colors duration-200"
                            >
                              Size {getSortIcon('size')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            <button 
                              onClick={() => handleSort('status')} 
                              className="flex items-center hover:text-gray-300 transition-colors duration-200"
                            >
                              Status {getSortIcon('status')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/30">
                        {scheduledReports.map((report) => (
                          <tr key={report.id} className="hover:bg-gray-800/30 transition-colors duration-200">
                            <td className="px-6 py-4 text-sm text-white font-medium">{report.name}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                report.type === 'Sales' ? 'bg-green-500/20 text-green-300' :
                                report.type === 'Analytics' ? 'bg-blue-500/20 text-blue-300' :
                                report.type === 'Finance' ? 'bg-yellow-500/20 text-yellow-300' :
                                report.type === 'Operations' ? 'bg-purple-500/20 text-purple-300' :
                                report.type === 'Support' ? 'bg-orange-500/20 text-orange-300' :
                                report.type === 'Executive' ? 'bg-red-500/20 text-red-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                                {report.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">{report.frequency}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{report.nextRun}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{report.size}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                report.status === 'Active' ? 'bg-emerald-500/20 text-emerald-300' :
                                report.status === 'Paused' ? 'bg-yellow-500/20 text-yellow-300' :
                                report.status === 'Failed' ? 'bg-red-500/20 text-red-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                  report.status === 'Active' ? 'bg-emerald-400' :
                                  report.status === 'Paused' ? 'bg-yellow-400' :
                                  report.status === 'Failed' ? 'bg-red-400' :
                                  'bg-gray-400'
                                }`}></div>
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                {(report.status === 'Active' || report.status === 'Paused') ? (
                                  <>
                                    <button 
                                      className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200"
                                      title="View Schedule"
                                    >
                                      <EyeIcon className="h-4 w-4" />
                                    </button>
                                    <button 
                                      className="p-1.5 text-gray-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded transition-all duration-200"
                                      title="Edit Schedule"
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button 
                                      className="p-1.5 text-gray-400 hover:text-purple-400 hover:bg-purple-500/10 rounded transition-all duration-200"
                                      title={report.status === 'Active' ? 'Pause Schedule' : 'Resume Schedule'}
                                    >
                                      {report.status === 'Active' ? (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      ) : (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m6-6a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                      )}
                                    </button>
                                    <button 
                                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200"
                                      title="Delete Schedule"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-500">
                                    {report.status === 'Pending' ? 'Upload data to create schedules' : 'Schedule inactive'}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        rightChildren={<AIChatDrawer />}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        drawerTriggerLabel="Ask AI"
      />
    </div>
  );
};

export default ReportsPage;
