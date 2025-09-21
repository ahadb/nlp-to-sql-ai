import React, { useState } from "react";
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
  const [activeReportTab, setActiveReportTab] = useState<'overview' | 'scheduled' | 'templates'>('overview');
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  // Sample data for reports
  const executiveMetrics = [
    { title: "Total Revenue", value: "$2.4M", change: "+12.5%", trend: "up", icon: CurrencyDollarIcon },
    { title: "Active Customers", value: "1,247", change: "+8.2%", trend: "up", icon: UserGroupIcon },
      { title: "Growth Rate", value: "23.4%", change: "+3.1%", trend: "up", icon: DocumentTextIcon },
    { title: "Reports Generated", value: "156", change: "+15.7%", trend: "up", icon: DocumentTextIcon },
  ];

  const scheduledReports = [
    { id: 1, name: "Daily Sales Summary", frequency: "Daily", lastRun: "Dec 15, 2024", nextRun: "Dec 16, 2024", status: "Active", recipients: 5 },
    { id: 2, name: "Weekly Customer Analysis", frequency: "Weekly", lastRun: "Dec 9, 2024", nextRun: "Dec 16, 2024", status: "Active", recipients: 3 },
    { id: 3, name: "Monthly Revenue Report", frequency: "Monthly", lastRun: "Dec 1, 2024", nextRun: "Jan 1, 2025", status: "Active", recipients: 8 },
    { id: 4, name: "Quarterly Business Review", frequency: "Quarterly", lastRun: "Oct 1, 2024", nextRun: "Jan 1, 2025", status: "Paused", recipients: 12 },
  ];

  const reportTemplates = [
    { id: 1, name: "Sales Performance Report", description: "Comprehensive sales metrics and trends", category: "Sales", usage: 45, lastUsed: "Dec 14, 2024" },
    { id: 2, name: "Customer Insights Report", description: "Customer behavior and segmentation analysis", category: "Marketing", usage: 32, lastUsed: "Dec 13, 2024" },
    { id: 3, name: "Financial Summary Report", description: "Revenue, expenses, and profitability overview", category: "Finance", usage: 28, lastUsed: "Dec 12, 2024" },
    { id: 4, name: "Product Performance Report", description: "Product sales and inventory analysis", category: "Operations", usage: 19, lastUsed: "Dec 10, 2024" },
  ];

  // Chart data
  const revenueData = [
    { month: 'Jan', revenue: 180000, target: 200000 },
    { month: 'Feb', revenue: 195000, target: 210000 },
    { month: 'Mar', revenue: 220000, target: 220000 },
    { month: 'Apr', revenue: 245000, target: 230000 },
    { month: 'May', revenue: 210000, target: 240000 },
    { month: 'Jun', revenue: 280000, target: 250000 },
    { month: 'Jul', revenue: 295000, target: 260000 },
    { month: 'Aug', revenue: 310000, target: 270000 },
    { month: 'Sep', revenue: 285000, target: 280000 },
    { month: 'Oct', revenue: 320000, target: 290000 },
    { month: 'Nov', revenue: 340000, target: 300000 },
    { month: 'Dec', revenue: 365000, target: 310000 },
  ];

  const customerGrowthData = [
    { month: 'Jan', customers: 850, newCustomers: 45 },
    { month: 'Feb', customers: 890, newCustomers: 52 },
    { month: 'Mar', customers: 925, newCustomers: 48 },
    { month: 'Apr', customers: 970, newCustomers: 65 },
    { month: 'May', customers: 1010, newCustomers: 58 },
    { month: 'Jun', customers: 1055, newCustomers: 72 },
    { month: 'Jul', customers: 1100, newCustomers: 68 },
    { month: 'Aug', customers: 1145, newCustomers: 75 },
    { month: 'Sep', customers: 1180, newCustomers: 62 },
    { month: 'Oct', customers: 1220, newCustomers: 80 },
    { month: 'Nov', customers: 1265, newCustomers: 85 },
    { month: 'Dec', customers: 1310, newCustomers: 78 },
  ];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}`}
            </p>
          ))}
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
                  <div key={index} className="bg-gradient-to-r from-slate-900/40 via-slate-800/20 to-slate-900/40 border border-gray-600/30 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-bold text-white">{metric.value}</h3>
                        <p className="text-sm text-gray-400">{metric.title}</p>
                      </div>
                      <span className={`text-sm font-medium ${
                        metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tab Navigation */}
              <div className="flex items-center space-x-2">
                {[
                  { id: 'overview', label: 'Overview', icon: ChartBarIcon },
                  { id: 'scheduled', label: 'Scheduled', icon: ClockIcon },
                  { id: 'templates', label: 'Templates', icon: DocumentTextIcon }
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Revenue Trend</h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-400">Revenue</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <span className="text-gray-400">Target</span>
                          </div>
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
                    </div>
                    <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">Customer Growth</h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                            <span className="text-gray-400">Total</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-cyan-500 rounded-full"></div>
                            <span className="text-gray-400">New</span>
                          </div>
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
                    </div>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700/30">
                          {[
                            { name: "December Sales Report", generated: "Dec 15, 2024", type: "Sales", size: "2.4 MB" },
                            { name: "Customer Analysis Q4", generated: "Dec 14, 2024", type: "Analytics", size: "1.8 MB" },
                            { name: "Monthly Revenue Summary", generated: "Dec 13, 2024", type: "Finance", size: "1.2 MB" },
                            { name: "Product Performance Report", generated: "Dec 12, 2024", type: "Operations", size: "3.1 MB" },
                            { name: "Weekly Team Performance", generated: "Dec 11, 2024", type: "HR", size: "1.6 MB" },
                            { name: "Quarterly Financial Review", generated: "Dec 10, 2024", type: "Finance", size: "4.2 MB" },
                          ].map((report, index) => (
                            <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-200">
                              <td className="px-6 py-4 text-sm text-white font-medium">{report.name}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                  report.type === 'Sales' ? 'bg-green-500/20 text-green-300' :
                                  report.type === 'Analytics' ? 'bg-blue-500/20 text-blue-300' :
                                  report.type === 'Finance' ? 'bg-yellow-500/20 text-yellow-300' :
                                  report.type === 'Operations' ? 'bg-purple-500/20 text-purple-300' :
                                  'bg-gray-500/20 text-gray-300'
                                }`}>
                                  {report.type}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-300">{report.generated}</td>
                              <td className="px-6 py-4 text-sm text-gray-300">{report.size}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center space-x-2">
                                  <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200">
                                    <EyeIcon className="h-4 w-4" />
                                  </button>
                                  <button className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all duration-200">
                                    <ArrowDownTrayIcon className="h-4 w-4" />
                                  </button>
                                  <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200">
                                    <TrashIcon className="h-4 w-4" />
                                  </button>
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
                              onClick={() => handleSort('frequency')} 
                              className="flex items-center hover:text-gray-300 transition-colors duration-200"
                            >
                              Frequency {getSortIcon('frequency')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            <button 
                              onClick={() => handleSort('lastRun')} 
                              className="flex items-center hover:text-gray-300 transition-colors duration-200"
                            >
                              Last Run {getSortIcon('lastRun')}
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
                              onClick={() => handleSort('status')} 
                              className="flex items-center hover:text-gray-300 transition-colors duration-200"
                            >
                              Status {getSortIcon('status')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                            <button 
                              onClick={() => handleSort('recipients')} 
                              className="flex items-center hover:text-gray-300 transition-colors duration-200"
                            >
                              Recipients {getSortIcon('recipients')}
                            </button>
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/30">
                        {scheduledReports.map((report) => (
                          <tr key={report.id} className="hover:bg-gray-800/30 transition-colors duration-200">
                            <td className="px-6 py-4 text-sm text-white font-medium">{report.name}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{report.frequency}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{report.lastRun}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{report.nextRun}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                report.status === 'Active' 
                                  ? 'bg-green-500/20 text-green-300' 
                                  : 'bg-gray-500/20 text-gray-300'
                              }`}>
                                {report.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-300">{report.recipients}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200">
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                <button className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all duration-200">
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200">
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeReportTab === 'templates' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reportTemplates.map((template) => (
                    <div key={template.id} className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6 hover:border-gray-500/50 transition-colors duration-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                          <div>
                            <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/20 text-gray-300 mt-1">
                              {template.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{template.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <span>Used {template.usage} times</span>
                        <span>Last used: {template.lastUsed}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button className="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200">
                          Use Template
                        </button>
                        <button className="px-3 py-2 border border-gray-600/50 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg text-sm transition-colors duration-200">
                          Preview
                        </button>
                      </div>
                    </div>
                  ))}
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
