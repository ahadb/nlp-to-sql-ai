import React, { useState, useEffect, useRef } from "react";
import { Sidebar, MobileSidebar, TopBar, Layout, AIChatDrawer } from "./index";
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  TableCellsIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon,
  TrashIcon,
  ArrowPathIcon,
  PlusIcon,
  LinkIcon,
  EyeIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  EnvelopeIcon,
  BellIcon,
  SparklesIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

const ConnectionsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeConnectionTab, setActiveConnectionTab] = useState<'sources' | 'history' | 'integrations'>('sources');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [dataSources, setDataSources] = useState<any[]>([]);
  const [hasData, setHasData] = useState(false);
  const [uploadHistory, setUploadHistory] = useState<any[]>([]);
  const actionsRef = useRef<HTMLDivElement>(null);

  // Fetch data sources and upload history
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch schemas
        const schemasResponse = await fetch('http://localhost:8000/upload/schemas');
        if (schemasResponse.ok) {
          const schemasData = await schemasResponse.json();
          const schemas = schemasData.schemas || [];
          setDataSources(schemas);
          setHasData(schemas.length > 0);
        }

        // Fetch upload history
        const historyResponse = await fetch('http://localhost:8000/upload/history');
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setUploadHistory(historyData.history || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setHasData(false);
      }
    };

    fetchData();
  }, []);

  // Handle click outside to close actions dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionsRef.current && !actionsRef.current.contains(event.target as Node)) {
        setIsActionsOpen(false);
      }
    };

    if (isActionsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActionsOpen]);

  // Dynamic connection stats based on data availability
  const connectionStats = hasData ? [
    { 
      title: "Active Connections", 
      value: `${dataSources.length}`, 
      change: "+2", 
      trend: "up",
      sparklineData: [1, 1, 2, 2, 3, 3, dataSources.length],
      color: "emerald"
    },
    { 
      title: "Data Synced Today", 
      value: "847K", 
      change: "+23.5%", 
      trend: "up",
      sparklineData: [420, 445, 380, 510, 680, 720, 847],
      color: "blue"
    },
    { 
      title: "Connection Health", 
      value: "98.5%", 
      change: "+1.2%", 
      trend: "up",
      sparklineData: [95, 96, 94, 97, 98, 98.2, 98.5],
      color: "purple"
    },
    { 
      title: "Available Integrations", 
      value: "24", 
      change: "+6", 
      trend: "up",
      sparklineData: [12, 14, 16, 18, 18, 20, 24],
      color: "cyan"
    },
  ] : [
    { 
      title: "Active Connections", 
      value: "0", 
      change: "0", 
      trend: "neutral",
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      color: "emerald"
    },
    { 
      title: "Data Synced Today", 
      value: "0", 
      change: "0%", 
      trend: "neutral",
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      color: "blue"
    },
    { 
      title: "Connection Health", 
      value: "0%", 
      change: "0%", 
      trend: "neutral",
      sparklineData: [0, 0, 0, 0, 0, 0, 0],
      color: "purple"
    },
    { 
      title: "Available Integrations", 
      value: "24", 
      change: "0", 
      trend: "neutral",
      sparklineData: [24, 24, 24, 24, 24, 24, 24],
      color: "cyan"
    },
  ];

  // Real data from uploaded sources
  const connectedSources = dataSources.map((schema, index) => ({
    id: schema.schema_id || index,
    name: schema.file_name || 'Unknown File',
    type: schema.type === 'CSV_FILE' ? 'CSV Upload' : schema.type === 'SQL_SCHEMA' ? 'SQL File' : schema.type,
    status: schema.status === 'Active' ? 'Active' : schema.row_count > 0 ? 'Active' : 'Error',
    records: schema.row_count || 0,
    lastSync: schema.last_updated || 'Unknown',
    size: schema.size || 'Unknown',
    icon: schema.type === 'CSV_FILE' ? TableCellsIcon : DocumentTextIcon,
    color: schema.row_count > 0 ? 'text-green-400' : 'text-red-400'
  }));

  // Real upload history is now fetched via useEffect and stored in uploadHistory state

  // Future integrations
  const futureIntegrations = [
    {
      name: "Google Sheets",
      description: "Connect spreadsheets directly for real-time data sync",
      icon: ChartBarIcon,
      status: "Coming Soon",
      popularity: "Most Requested",
      color: "text-green-500"
    },
    {
      name: "Shopify",
      description: "Import orders, customers, and product data automatically",
      icon: ShoppingCartIcon,
      status: "Coming Soon", 
      popularity: "High Demand",
      color: "text-purple-500"
    },
    {
      name: "Stripe",
      description: "Sync payment data and customer transactions",
      icon: CreditCardIcon,
      status: "Coming Soon",
      popularity: "Popular",
      color: "text-blue-500"
    },
    {
      name: "HubSpot CRM",
      description: "Connect your CRM data for customer insights",
      icon: LinkIcon,
      status: "Coming Soon",
      popularity: "Requested",
      color: "text-orange-500"
    },
    {
      name: "Salesforce",
      description: "Enterprise CRM integration for sales data",
      icon: ChartBarIcon,
      status: "Coming Soon",
      popularity: "Enterprise",
      color: "text-cyan-500"
    },
    {
      name: "QuickBooks",
      description: "Financial data and accounting integration",
      icon: DocumentTextIcon,
      status: "Coming Soon",
      popularity: "SMB Favorite",
      color: "text-yellow-500"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon className="h-5 w-5 text-green-400" />;
      case 'Syncing':
        return <ClockIcon className="h-5 w-5 text-yellow-400 animate-pulse" />;
      case 'Error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  // const getUploadStatusBadge = (status: string) => {
  //   const statusStyles = {
  //     'Completed': 'bg-green-500/20 text-green-300',
  //     'Processing': 'bg-yellow-500/20 text-yellow-300',
  //     'Failed': 'bg-red-500/20 text-red-300'
  //   };
  //   return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-500/20 text-gray-300';
  // };

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
            <div className="pt-12 px-6 pb-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Data Connections</h1>
                  <p className="text-gray-400">Manage your data sources and integrations</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative" ref={actionsRef}>
                    <button 
                      onClick={() => setIsActionsOpen(!isActionsOpen)}
                      className="flex items-center space-x-2 px-4 py-2 border border-gray-600/50 text-gray-300 hover:text-white hover:border-gray-500 text-sm rounded-lg transition-colors duration-200 cursor-pointer"
                    >
                      <EllipsisVerticalIcon className="h-4 w-4" />
                      <span>Actions</span>
                      <ChevronDownIcon className={`h-3 w-3 transition-transform duration-200 ${isActionsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isActionsOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-[#262626] border border-gray-600/50 rounded-lg shadow-xl z-50">
                        <div className="py-2">
                          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200">
                            <CloudArrowUpIcon className="h-4 w-4 text-gray-400" />
                            <span>Upload Data</span>
                          </button>
                          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200">
                            <BellIcon className="h-4 w-4 text-gray-400" />
                            <span>Notify Updates</span>
                          </button>
                          <div className="border-t border-gray-700/50 my-1"></div>
                          <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200">
                            <LinkIcon className="h-4 w-4 text-gray-400" />
                            <span>Test Connection</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(true)}
                    className="border border-orange-400 text-orange-400 px-4 py-2 rounded-lg hover:border-orange-300 hover:text-orange-300 hover:bg-orange-500/10 transition-all duration-200 group flex items-center space-x-2 cursor-pointer"
                  >
                    <SparklesIcon className="h-4 w-4 text-orange-400 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium text-sm">Ask AI</span>
                  </button>
                </div>
              </div>

              {/* Demo Badge */}
              <div className="mb-6">
                <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-xl p-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">AI Not Enabled on this Tab</h3>
                    <p className="text-gray-300 text-sm">This page showcases the data connections interface. In the full version, we can customize this further with AI-powered data validation, intelligent schema detection, and automated data quality insights based on your specific data sources. Most features are disabled.</p>
                  </div>
                </div>
              </div>

              {/* Connection Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {connectionStats.map((stat, index) => (
                  <div key={index} className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-4 hover:border-gray-500/50 transition-all duration-300 relative">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
                        <p className="text-sm text-gray-400">{stat.title}</p>
                      </div>
                      <span className={`text-sm font-medium ${
                        stat.trend === 'up' ? 'text-emerald-400' : 
                        stat.trend === 'down' ? 'text-red-400' : 
                        'text-gray-400'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                    
                    {/* Sparkline */}
                    <div className="h-8 mt-2">
                      <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                        <polyline
                          fill="none"
                          stroke={
                            stat.color === 'emerald' ? 'rgb(52 211 153)' :
                            stat.color === 'blue' ? 'rgb(59 130 246)' :
                            stat.color === 'purple' ? 'rgb(168 85 247)' :
                            'rgb(34 211 238)'
                          }
                          strokeWidth="2"
                          points={stat.sparklineData.map((value, i) => {
                            const x = (i / (stat.sparklineData.length - 1)) * 100;
                            const minVal = Math.min(...stat.sparklineData);
                            const maxVal = Math.max(...stat.sparklineData);
                            const y = maxVal === minVal ? 10 : 20 - ((value - minVal) / (maxVal - minVal)) * 16;
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
                  { id: 'sources', label: 'Connected Sources', icon: LinkIcon },
                  { id: 'history', label: 'Upload History', icon: ClockIcon },
                  { id: 'integrations', label: 'Integrations', icon: PlusIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveConnectionTab(tab.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200 border rounded-lg ${
                      activeConnectionTab === tab.id
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
              {activeConnectionTab === 'sources' && (
                <div className="space-y-6">
                  {connectedSources.map((source) => (
                    <div key={source.id} className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6 hover:border-gray-500/50 transition-colors duration-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <source.icon className="h-6 w-6 text-gray-400" />
                          <div>
                            <h3 className="text-lg font-semibold text-white">{source.name}</h3>
                            <p className="text-sm text-gray-400">{source.type} • {source.records.toLocaleString()} records • {source.size}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(source.status)}
                            <span className={`text-sm font-medium ${
                              source.status === 'Active' ? 'text-green-400' :
                              source.status === 'Syncing' ? 'text-yellow-400' : 'text-red-400'
                            }`}>
                              {source.status}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded-lg transition-all duration-200">
                              <ArrowPathIcon className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200">
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-700/50">
                        <p className="text-sm text-gray-400">Last synced: {source.lastSync}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeConnectionTab === 'history' && (
                <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl">
                  <div className="p-6 border-b border-gray-700/50">
                    <h3 className="text-lg font-semibold text-white">Upload History</h3>
                    <p className="text-gray-400 text-sm mt-1">Track all your data uploads and processing status</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#262626] border-b border-gray-600/30">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">File Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Upload Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Size</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Records</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/30">
                        {uploadHistory.length > 0 ? uploadHistory.map((upload) => (
                          <tr key={upload.id} className="hover:bg-gray-800/30 transition-colors duration-200">
                            <td className="px-6 py-4 text-sm text-white font-medium">{upload.file_name}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{upload.file_type}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{upload.upload_timestamp}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{upload.size_display}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{(upload.records_processed || 0).toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                upload.status === 'success' ? 'bg-green-500/20 text-green-300' :
                                upload.status === 'failed' ? 'bg-red-500/20 text-red-300' :
                                upload.status === 'processing' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                                <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                  upload.status === 'success' ? 'bg-green-400' :
                                  upload.status === 'failed' ? 'bg-red-400' :
                                  upload.status === 'processing' ? 'bg-yellow-400' :
                                  'bg-gray-400'
                                }`}></div>
                                {upload.status === 'success' ? 'Completed' : 
                                 upload.status === 'failed' ? 'Failed' :
                                 upload.status === 'processing' ? 'Processing' : upload.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                {upload.status === 'success' ? (
                                  <>
                                    <button 
                                      className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200"
                                      title="View Details"
                                    >
                                      <EyeIcon className="h-4 w-4" />
                                    </button>
                                    <button 
                                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200"
                                      title="Delete"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </>
                                ) : upload.status === 'failed' ? (
                                  <>
                                    <button 
                                      className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200"
                                      title="View Error Details"
                                    >
                                      <EyeIcon className="h-4 w-4" />
                                    </button>
                                    <button 
                                      className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all duration-200"
                                      title="Retry Upload"
                                    >
                                      <ArrowPathIcon className="h-4 w-4" />
                                    </button>
                                    <button 
                                      className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200"
                                      title="Delete"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  </>
                                ) : (
                                  <span className="text-xs text-gray-500">Processing...</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={7} className="px-6 py-12 text-center">
                              <div className="flex flex-col items-center">
                                <ClockIcon className="h-8 w-8 text-gray-500 mb-3" />
                                <div>
                                  <p className="text-white font-medium text-sm">No upload history yet</p>
                                  <p className="text-gray-500 text-xs mt-1">Upload files to see processing history</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeConnectionTab === 'integrations' && (
                <div>
                  <div className="mb-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Connect Your Business Tools</h3>
                    <p className="text-gray-400">Seamlessly integrate with your existing workflow and get real-time insights</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {futureIntegrations.map((integration, index) => (
                      <div key={index} className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6 hover:border-gray-500/50 transition-colors duration-200">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <integration.icon className="h-6 w-6 text-gray-400" />
                            <div>
                              <h3 className="text-lg font-semibold text-white">{integration.name}</h3>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/20 text-blue-300 mt-1">
                                {integration.popularity}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-400 text-sm mb-6">{integration.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-500/20 text-yellow-300">
                            {integration.status}
                          </span>
                          <button className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white text-sm rounded-md transition-colors duration-200">
                            <EnvelopeIcon className="h-4 w-4" />
                            <span>Notify Me</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Early Access CTA */}
                  <div className="mt-12 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-xl p-8 text-center">
                    <h3 className="text-xl font-bold text-white mb-2">Get Early Access</h3>
                    <p className="text-gray-300 mb-6">Be the first to know when new integrations are available. Join our beta program for priority access.</p>
                    <div className="flex items-center justify-center space-x-4">
                      <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg transition-colors duration-200">
                        Join Beta Program
                      </button>
                      <button className="px-6 py-3 border border-gray-600/50 text-gray-300 hover:text-white hover:border-gray-500 font-medium rounded-lg transition-colors duration-200">
                        Request Integration
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        }
        rightChildren={<AIChatDrawer 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
          hasData={hasData}
        />}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        drawerTriggerLabel="Ask AI"
      />
    </div>
  );
};

export default ConnectionsPage;
