import React, { useState } from "react";
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

  // Sample data for connected sources
  const connectedSources = [
    {
      id: 1,
      name: "Sales Data 2024",
      type: "CSV Upload",
      status: "Active",
      records: 1247,
      lastSync: "Dec 15, 2024 2:30 PM",
      size: "2.4 MB",
      icon: TableCellsIcon,
      color: "text-green-400"
    },
    {
      id: 2,
      name: "Customer Database",
      type: "SQL File",
      status: "Active", 
      records: 856,
      lastSync: "Dec 14, 2024 9:15 AM",
      size: "1.8 MB",
      icon: DocumentTextIcon,
      color: "text-blue-400"
    },
    {
      id: 3,
      name: "Order History Q4",
      type: "CSV Upload",
      status: "Syncing",
      records: 2103,
      lastSync: "Dec 15, 2024 3:45 PM",
      size: "3.2 MB",
      icon: TableCellsIcon,
      color: "text-yellow-400"
    },
    {
      id: 4,
      name: "Product Catalog",
      type: "SQL File",
      status: "Error",
      records: 0,
      lastSync: "Dec 13, 2024 1:20 PM",
      size: "856 KB",
      icon: DocumentTextIcon,
      color: "text-red-400"
    }
  ];

  // Upload history
  const uploadHistory = [
    {
      id: 1,
      filename: "sales_data_december.csv",
      uploadDate: "Dec 15, 2024 2:30 PM",
      size: "2.4 MB",
      status: "Completed",
      records: 1247,
      type: "CSV"
    },
    {
      id: 2,
      filename: "customer_database.sql",
      uploadDate: "Dec 14, 2024 9:15 AM", 
      size: "1.8 MB",
      status: "Completed",
      records: 856,
      type: "SQL"
    },
    {
      id: 3,
      filename: "orders_q4_2024.csv",
      uploadDate: "Dec 15, 2024 3:45 PM",
      size: "3.2 MB",
      status: "Processing",
      records: 2103,
      type: "CSV"
    },
    {
      id: 4,
      filename: "product_catalog_v2.sql",
      uploadDate: "Dec 13, 2024 1:20 PM",
      size: "856 KB",
      status: "Failed",
      records: 0,
      type: "SQL"
    },
    {
      id: 5,
      filename: "marketing_leads.csv",
      uploadDate: "Dec 12, 2024 4:10 PM",
      size: "1.2 MB", 
      status: "Completed",
      records: 634,
      type: "CSV"
    }
  ];

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

  const getUploadStatusBadge = (status: string) => {
    const statusStyles = {
      'Completed': 'bg-green-500/20 text-green-300',
      'Processing': 'bg-yellow-500/20 text-yellow-300',
      'Failed': 'bg-red-500/20 text-red-300'
    };
    return statusStyles[status as keyof typeof statusStyles] || 'bg-gray-500/20 text-gray-300';
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
            <div className="pt-12 px-6 pb-6 border-b border-gray-700/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">Data Connections</h1>
                  <p className="text-gray-400">Manage your data sources and integrations</p>
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
                    className="border border-blue-500/50 text-blue-400 px-4 py-2 rounded-lg hover:border-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200 group flex items-center space-x-2"
                  >
                    <SparklesIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span className="font-medium text-sm">Ask AI</span>
                  </button>
                </div>
              </div>

              {/* Connection Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-r from-slate-900/40 via-slate-800/20 to-slate-900/40 border border-gray-600/30 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-white">4</h3>
                      <p className="text-sm text-gray-400">Active Sources</p>
                    </div>
                    <span className="text-sm font-medium text-green-400">+2 this week</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-slate-900/40 via-slate-800/20 to-slate-900/40 border border-gray-600/30 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-white">4.2K</h3>
                      <p className="text-sm text-gray-400">Total Records</p>
                    </div>
                    <span className="text-sm font-medium text-green-400">+1.2K today</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-slate-900/40 via-slate-800/20 to-slate-900/40 border border-gray-600/30 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-white">Dec 15</h3>
                      <p className="text-sm text-gray-400">Last Sync</p>
                    </div>
                    <span className="text-sm font-medium text-gray-400">2 mins ago</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-slate-900/40 via-slate-800/20 to-slate-900/40 border border-gray-600/30 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-bold text-white">12 GB</h3>
                      <p className="text-sm text-gray-400">Storage Limit</p>
                    </div>
                    <span className="text-sm font-medium text-green-400">8.2 MB used</span>
                  </div>
                </div>
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
                        {uploadHistory.map((upload) => (
                          <tr key={upload.id} className="hover:bg-gray-800/30 transition-colors duration-200">
                            <td className="px-6 py-4 text-sm text-white font-medium">{upload.filename}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{upload.type}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{upload.uploadDate}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{upload.size}</td>
                            <td className="px-6 py-4 text-sm text-gray-300">{upload.records.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getUploadStatusBadge(upload.status)}`}>
                                {upload.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200">
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                <button className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all duration-200">
                                  <ArrowPathIcon className="h-4 w-4" />
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
                          <span className="text-sm text-yellow-400 font-medium">{integration.status}</span>
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
        rightChildren={<AIChatDrawer />}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        drawerTriggerLabel="Ask AI"
      />
    </div>
  );
};

export default ConnectionsPage;
