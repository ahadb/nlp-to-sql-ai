import React, { useState, useEffect } from 'react';
import {
  CircleStackIcon,
  DocumentIcon,
  EyeIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ClockIcon as ProcessingIcon,
  CloudArrowUpIcon,
  ChartBarIcon,
  EnvelopeIcon,
  LightBulbIcon,
  SparklesIcon,
  EllipsisVerticalIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { FileUpload } from './index';
import { api } from '../services/api';

import DashboardCards from './DashboardCards';

interface DataSource {
  id: string;
  name: string;
  type: 'CSV' | 'SQL' | 'Excel';
  rows: number;
  lastUpdated: string;
  status: 'active' | 'processing' | 'error';
  size: string;
}

interface MyDataTabProps {
  onOpenAIChat?: () => void;
}

const MyDataTab: React.FC<MyDataTabProps> = ({ onOpenAIChat }) => {
  const [activeInsightTab, setActiveInsightTab] = useState<number>(0);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [showDemoPanel, setShowDemoPanel] = useState(true);
  const [tables, setTables] = useState<any[]>([]);
  const [reorderedTables, setReorderedTables] = useState<any[]>([]);
  const [tableData, setTableData] = useState<Record<string, any[]>>({});

  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch tables from backend
  const fetchTables = async () => {
    try {
      console.log('🔍 Fetching tables from /tables endpoint...');
      const response = await api.getTables();
      console.log('✅ Tables response:', response);
      
      if (response.tables && response.tables.length > 0) {
        setTables(response.tables);
      }
    } catch (error) {
      console.error('❌ Error fetching tables:', error);
    }
  };

  // Fetch data for a specific table (limited to 5 rows)
  const fetchTableData = async (tableName: string, schemaName: string) => {
    try {
      console.log(`🔍 Fetching data for table: ${tableName} in schema: ${schemaName}`);
      const response = await api.getTableData(tableName, schemaName, 5);
      console.log('✅ Table data response:', response);
      
      if (response.data) {
        setTableData(prev => ({
          ...prev,
          [tableName]: response.data
        }));
      }
    } catch (error) {
      console.error(`❌ Error fetching data for table ${tableName}:`, error);
    }
  };
  
  // Fetch data sources from backend
  const fetchDataSources = async () => {
    try {
      setIsLoading(true);
      const response = await api.getDataSources();
      
      // Transform backend response to match DataSource interface
      const transformedSources = response.schemas.map((schema: any) => ({
        id: schema.schema_id,
        name: schema.file_name,
        type: schema.type,
        rows: schema.row_count,
        lastUpdated: schema.last_updated,
        status: schema.status.toLowerCase(),
        size: schema.size
      }));
      
      setDataSources(transformedSources);
    } catch (error) {
      console.error('Failed to fetch data sources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load data sources and tables on component mount
  useEffect(() => {
    fetchDataSources();
    fetchTables();
  }, []);

  // Reorder tables to put Sales first whenever tables change
  useEffect(() => {
    if (tables.length > 0) {
      const ordered = [...tables];
      const salesIndex = ordered.findIndex(table => 
        table.table_name.toLowerCase().includes('sales') || 
        table.display_name?.toLowerCase().includes('sales')
      );
      
      if (salesIndex > 0) {
        // Move sales table to first position
        const salesTable = ordered.splice(salesIndex, 1)[0];
        ordered.unshift(salesTable);
      }
      
      setReorderedTables(ordered);
      
      // Load data for the first table automatically (now guaranteed to be Sales if it exists)
      const firstTable = ordered[0];
      fetchTableData(firstTable.table_name, firstTable.schema_id);
    } else {
      setReorderedTables([]);
    }
  }, [tables]);

  // Handle tab changes and fetch corresponding table data
  const handleTabChange = async (tabIndex: number) => {
    setActiveInsightTab(tabIndex);
    
    if (reorderedTables.length > 0 && tabIndex < reorderedTables.length) {
      const selectedTable = reorderedTables[tabIndex];
      
      if (selectedTable) {
        await fetchTableData(selectedTable.table_name, selectedTable.schema_id);
      }
    }
  };

  // Smart column mapping for SMB-focused insights
  const getSmartColumns = (tableName: string, data: any[]) => {
    if (data.length === 0) return [];
    
    const allColumns = Object.keys(data[0]);
    const isFirstTable = reorderedTables[0]?.table_name === tableName;
    
    console.log('🔍 Smart mapping for table:', tableName);
    console.log('📋 Available columns:', allColumns);
    
    // Sales table gets special treatment (first table is prioritized as sales)
    if (isFirstTable || tableName.toLowerCase().includes('sales')) {
      const productCol = allColumns.find(col => {
        const colLower = col.toLowerCase();
        // Exclude customer/company columns from product matching
        if (colLower.includes('customer') || colLower.includes('company') || colLower.includes('client')) {
          return false;
        }
        return ['product', 'item', 'service', 'plan'].some(keyword => 
          colLower.includes(keyword)
        );
      }) || allColumns[0];
      
      const revenueCol = allColumns.find(col => 
        ['revenue', 'amount', 'total', 'price', 'value'].some(keyword => 
          col.toLowerCase().includes(keyword)
        )
      ) || allColumns[1];
      
      const unitsCol = allColumns.find(col => {
        const colLower = col.toLowerCase();
        return ['quantity', 'qty', 'count', 'units', 'units_sold', 'amount_sold'].some(keyword => 
          colLower === keyword || colLower.endsWith('_' + keyword) || colLower.startsWith(keyword + '_')
        );
      }) || allColumns[2];
      
      const customerCol = allColumns.find(col => {
        const colLower = col.toLowerCase();
        // Prioritize contact_name first
        return colLower === 'contact_name';
      }) || allColumns.find(col => {
        const colLower = col.toLowerCase();
        // Then other name columns
        return ['customer_name', 'client_name', 'company_name', 'buyer_name'].some(keyword => 
          colLower === keyword
        );
      }) || allColumns.find(col => {
        const colLower = col.toLowerCase();
        // Then look for any customer/company column that's not an ID
        return ['customer', 'client', 'company', 'buyer', 'contact'].some(keyword => 
          colLower.includes(keyword) && !colLower.includes('id')
        );
      }) || allColumns[3];
      
      const statusCol = allColumns.find(col => {
        const colLower = col.toLowerCase();
        return ['status', 'customer_status', 'account_status'].some(keyword => 
          colLower.includes(keyword)
        );
      }) || allColumns[4];
      
      console.log('🎯 Column mapping results:');
      console.log('Product:', productCol);
      console.log('Revenue:', revenueCol);
      console.log('Units:', unitsCol);
      console.log('Customer:', customerCol);
      console.log('Status:', statusCol);
      
      return [
        { key: productCol, label: 'Product', title: 'Product or service name' },
        { key: revenueCol, label: 'Revenue', title: 'Revenue amount' },
        { key: unitsCol, label: 'Units', title: 'Units sold' },
        { key: customerCol, label: 'Customer', title: 'Customer contact name' },
        { key: statusCol, label: 'Status', title: 'Customer status' }
      ].filter(col => col.key); // Remove any undefined columns
    }
    
    // Billing table gets special treatment
    if (tableName.toLowerCase().includes('billing') || tableName.toLowerCase().includes('invoice') || tableName.toLowerCase().includes('payment')) {
      const customerCol = allColumns.find(col => {
        const colLower = col.toLowerCase();
        // Prioritize contact_name first for billing
        return colLower === 'contact_name';
      }) || allColumns.find(col => {
        const colLower = col.toLowerCase();
        return ['customer_name', 'client_name', 'company_name', 'buyer_name'].some(keyword => 
          colLower === keyword
        );
      }) || allColumns.find(col => {
        const colLower = col.toLowerCase();
        return ['customer', 'client', 'company', 'buyer', 'contact'].some(keyword => 
          colLower.includes(keyword) && !colLower.includes('id')
        );
      }) || allColumns[0];
      
      const amountCol = allColumns.find(col => 
        ['amount', 'invoice_amount', 'total', 'balance', 'value', 'bill_amount'].some(keyword => 
          col.toLowerCase().includes(keyword)
        )
      ) || allColumns[1];
      
      const statusCol = allColumns.find(col => {
        const colLower = col.toLowerCase();
        return ['status', 'payment_status', 'invoice_status', 'billing_status'].some(keyword => 
          colLower.includes(keyword)
        );
      }) || allColumns[2];
      
      const dueDateCol = allColumns.find(col => 
        ['due_date', 'due', 'payment_due', 'deadline'].some(keyword => 
          col.toLowerCase().includes(keyword)
        )
      ) || allColumns[3];
      
      const invoiceCol = allColumns.find(col => 
        ['invoice', 'invoice_number', 'bill_number', 'reference'].some(keyword => 
          col.toLowerCase().includes(keyword)
        )
      ) || allColumns[4];
      
      console.log('💰 Billing column mapping:');
      console.log('Customer:', customerCol);
      console.log('Amount:', amountCol);
      console.log('Status:', statusCol);
      console.log('Due Date:', dueDateCol);
      console.log('Invoice:', invoiceCol);
      
      return [
        { key: customerCol, label: 'Customer', title: 'Customer or company name' },
        { key: amountCol, label: 'Amount', title: 'Invoice amount' },
        { key: statusCol, label: 'Status', title: 'Payment status' },
        { key: dueDateCol, label: 'Due Date', title: 'Payment due date' },
        { key: invoiceCol, label: 'Invoice', title: 'Invoice number' }
      ].filter(col => col.key);
    }
    
    // Support table gets special treatment
    if (tableName.toLowerCase().includes('support') || tableName.toLowerCase().includes('ticket') || tableName.toLowerCase().includes('help')) {
      const customerCol = allColumns.find(col => {
        const colLower = col.toLowerCase();
        // Prioritize contact_name first for support
        return colLower === 'contact_name';
      }) || allColumns.find(col => {
        const colLower = col.toLowerCase();
        return ['customer_name', 'client_name', 'company_name', 'user_name'].some(keyword => 
          colLower === keyword
        );
      }) || allColumns.find(col => {
        const colLower = col.toLowerCase();
        return ['customer', 'client', 'company', 'user', 'contact'].some(keyword => 
          colLower.includes(keyword) && !colLower.includes('id')
        );
      }) || allColumns[0];
      
      const issueTypeCol = allColumns.find(col => 
        ['issue_type', 'type', 'category', 'issue_category', 'problem_type'].some(keyword => 
          col.toLowerCase().includes(keyword)
        )
      ) || allColumns[1];
      
      const priorityCol = allColumns.find(col => 
        ['priority', 'urgency', 'severity', 'level'].some(keyword => 
          col.toLowerCase().includes(keyword)
        )
      ) || allColumns[2];
      
      const statusCol = allColumns.find(col => {
        const colLower = col.toLowerCase();
        return ['status', 'ticket_status', 'state', 'resolution_status'].some(keyword => 
          colLower.includes(keyword)
        );
      }) || allColumns[3];
      
      console.log('🎫 Support column mapping:');
      console.log('Customer:', customerCol);
      console.log('Issue Type:', issueTypeCol);
      console.log('Priority:', priorityCol);
      console.log('Status:', statusCol);
      
      return [
        { key: customerCol, label: 'Customer', title: 'Customer or user name' },
        { key: issueTypeCol, label: 'Issue Type', title: 'Type of support issue' },
        { key: priorityCol, label: 'Priority', title: 'Issue priority level' },
        { key: statusCol, label: 'Status', title: 'Ticket status' }
      ].filter(col => col.key);
    }
    
    // For other tables, show first 5 columns with smart labels
    return allColumns.slice(0, 5).map(col => ({
      key: col,
      label: col.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      title: col.replace(/_/g, ' ')
    }));
  };

  // Render dynamic table based on current tab and available data
  const renderDynamicTable = () => {
    const currentTable = reorderedTables[activeInsightTab];
    const data = currentTable ? (tableData[currentTable.table_name] || []) : [];
    
    // Get smart columns for this table
    const smartColumns = data.length > 0 ? getSmartColumns(currentTable?.table_name || '', data) : [];
    
    // Always render table container with borders
    return (
      <div className="bg-[#1a1a1a] border border-gray-600/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto scrollbar-dark">
          <table className="w-full border-collapse">
            {/* Show headers if we have data, otherwise show placeholder headers */}
            <thead className="bg-[#262626] border-b border-gray-600/50">
              <tr>
                {data.length > 0 ? (
                  smartColumns.map((column) => (
                    <th key={column.key} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title={column.title}>
                      {column.label}
                    </th>
                  ))
                ) : (
                  // SMB-focused placeholder headers (5 columns)
                  <>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title="Product or service name">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title="Revenue amount">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title="Units sold">Units</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title="Customer contact name">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap" title="Customer status or order date">Status</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600/50">
              {data.length > 0 ? (
                data.slice(0, 5).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-200">
                    {smartColumns.map((column) => (
                      <td key={column.key} className="px-4 py-3 text-sm text-white border-r border-gray-600/30 whitespace-nowrap" title={row[column.key]?.toString()}>
                        {column.label === 'Status' ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            // Sales status badges
                            row[column.key]?.toString().toLowerCase() === 'active' ? 'bg-green-500/20 text-green-300' :
                            row[column.key]?.toString().toLowerCase() === 'at risk' ? 'bg-amber-500/20 text-amber-300' :
                            row[column.key]?.toString().toLowerCase() === 'vip' ? 'bg-purple-500/20 text-purple-300' :
                            row[column.key]?.toString().toLowerCase() === 'churned' ? 'bg-red-500/20 text-red-300' :
                            row[column.key]?.toString().toLowerCase() === 'new' ? 'bg-blue-500/20 text-blue-300' :
                            // Billing status badges
                            row[column.key]?.toString().toLowerCase() === 'paid' ? 'bg-green-500/20 text-green-300' :
                            row[column.key]?.toString().toLowerCase() === 'pending' ? 'bg-amber-500/20 text-amber-300' :
                            row[column.key]?.toString().toLowerCase() === 'overdue' ? 'bg-red-500/20 text-red-300' :
                            row[column.key]?.toString().toLowerCase() === 'failed' ? 'bg-red-500/20 text-red-300' :
                            row[column.key]?.toString().toLowerCase() === 'processing' ? 'bg-blue-500/20 text-blue-300' :
                            // Support status badges
                            row[column.key]?.toString().toLowerCase() === 'resolved' ? 'bg-green-500/20 text-green-300' :
                            row[column.key]?.toString().toLowerCase() === 'in progress' ? 'bg-blue-500/20 text-blue-300' :
                            row[column.key]?.toString().toLowerCase() === 'closed' ? 'bg-gray-500/20 text-gray-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {row[column.key]?.toString() || '-'}
                          </span>
                        ) : column.label === 'Priority' ? (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            row[column.key]?.toString().toLowerCase() === 'critical' ? 'bg-red-500/20 text-red-300' :
                            row[column.key]?.toString().toLowerCase() === 'high' ? 'bg-orange-500/20 text-orange-300' :
                            row[column.key]?.toString().toLowerCase() === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                            row[column.key]?.toString().toLowerCase() === 'low' ? 'bg-blue-500/20 text-blue-300' :
                            'bg-gray-500/20 text-gray-300'
                          }`}>
                            {row[column.key]?.toString() || '-'}
                          </span>
                        ) : (column.label === 'Revenue' || column.label === 'Amount') && row[column.key]?.toString().match(/^\d/) ? (
                          <span className="text-green-400 font-medium">
                            ${parseFloat(row[column.key]?.toString() || '0').toLocaleString()}
                          </span>
                        ) : (
                          row[column.key]?.toString() || '-'
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={smartColumns.length || 5} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <CircleStackIcon className="h-12 w-12 text-gray-500 mb-4" />
                      {!currentTable ? (
                        <>
                          <p className="text-gray-400 text-sm">No table data available</p>
                          <p className="text-gray-500 text-xs mt-2">Upload some data to see insights here</p>
                        </>
                      ) : (
                        <>
                          <p className="text-gray-400 text-sm">Loading table data...</p>
                          <p className="text-gray-500 text-xs mt-2">Table: {currentTable.display_name || currentTable.table_name}</p>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
  
  // Calculate demo stats based on uploaded data
  const calculateDemoStats = () => {
    const hasData = dataSources.length > 0;
    
    if (!hasData) {
      return {
        totalRecords: 0,
        queryVolume: 0,
        revenue: 0,
        dataQuality: 0,
        growthPercentage: "0%",
        qualityGrowth: "0%",
        sparklinePoints: "0,20 14,20 28,20 42,20 56,20 70,20 84,20 100,20" // Flat line
      };
    }
    
    // Simulate realistic stats based on actual data
    const actualRows = dataSources.reduce((sum, source) => sum + source.rows, 0);
    const demoMultiplier = actualRows < 10 ? 50 : actualRows < 100 ? 25 : 10;
    
    // Extract revenue from sales data if available
    const salesTable = tables.find(table => 
      table.table_name.toLowerCase().includes('sales') || 
      table.display_name?.toLowerCase().includes('sales')
    );
    
    let baseRevenue = 0;
    if (salesTable && tableData[salesTable.table_name]) {
      const salesData = tableData[salesTable.table_name];
      // Try to find revenue in the data
      const revenueCol = Object.keys(salesData[0] || {}).find(col => 
        ['revenue', 'amount', 'total', 'price', 'value'].some(keyword => 
          col.toLowerCase().includes(keyword)
        )
      );
      
      if (revenueCol) {
        baseRevenue = salesData.reduce((sum, row) => {
          const value = parseFloat(row[revenueCol]?.toString().replace(/[$,]/g, '') || '0');
          return sum + value;
        }, 0);
      }
    }
    
    // Calculate data quality based on actual data completeness
    let totalCells = 0;
    let nonEmptyCells = 0;
    
    Object.values(tableData).forEach(data => {
      data.forEach(row => {
        Object.values(row).forEach(value => {
          totalCells++;
          if (value !== null && value !== undefined && value !== '') {
            nonEmptyCells++;
          }
        });
      });
    });
    
    const actualQuality = totalCells > 0 ? (nonEmptyCells / totalCells) * 100 : 95;
    const simulatedQuality = Math.max(95, Math.min(99.5, actualQuality + Math.random() * 3));
    
    return {
      totalRecords: actualRows * demoMultiplier,
      queryVolume: Math.floor(tables.length * 15 + Math.random() * 20),
      revenue: Math.floor(baseRevenue * (demoMultiplier / 2)),
      dataQuality: simulatedQuality,
      growthPercentage: ["+18%", "+12%", "+24%", "+15%"][Math.floor(Math.random() * 4)],
      qualityGrowth: ["+2.1%", "+1.8%", "+3.2%", "+2.7%"][Math.floor(Math.random() * 4)],
      sparklinePoints: "0,20 14,18 28,15 42,12 56,8 70,6 84,4 100,2" // Upward trend
    };
  };

  const demoStats = calculateDemoStats();

  const getIcon = (type: string) => {
    switch (type) {
      case 'CSV':
        return DocumentIcon;
      case 'Excel':
        return DocumentIcon;
      case 'SQL':
        return CircleStackIcon;
      default:
        return DocumentIcon;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return CheckCircleIcon;
      case 'processing':
        return ProcessingIcon;
      case 'error':
        return ExclamationTriangleIcon;
      default:
        return CheckCircleIcon;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400';
      case 'processing':
        return 'text-amber-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const filteredDataSources = dataSources.filter(source =>
    source.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400">Manage and explore your business data</p>
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
                      <ChartBarIcon className="h-4 w-4 text-gray-400" />
                      <span>Generate Report</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      <span>Schedule Reports</span>
                    </button>
                    <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 transition-colors duration-200">
                      <LightBulbIcon className="h-4 w-4 text-gray-400" />
                      <span>AI Recommendations</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={onOpenAIChat}
              className="border border-blue-500/50 text-blue-400 px-4 py-2 rounded-lg hover:border-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all duration-200 group flex items-center space-x-2"
            >
              <SparklesIcon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium text-sm">Ask AI</span>
            </button>
          </div>
        </div>
      </div>

        {/* Demo Environment Section */}
        {showDemoPanel && (
        <div className="mb-8">
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-6 relative">
          {/* Close Button */}
          <button 
            onClick={() => setShowDemoPanel(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200 p-1 hover:bg-gray-700/50 rounded"
            title="Close demo panel"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Verbiage */}
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <h3 className="text-xl font-semibold text-white">Interactive Demo Environment</h3>
                <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                  Demo Mode
                </span>
              </div>
              <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                Experience DataMind AI with curated sample business data. Download and upload the provided templates to see instant insights and intelligent column mapping.
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="text-gray-300 text-sm">• Smart sales & revenue analysis</div>
                <div className="text-gray-300 text-sm">• Customer support ticket insights</div>
                <div className="text-gray-300 text-sm">• Billing & payment tracking</div>
              </div>
              
            </div>
            
            {/* Right Side - Sample File Cards */}
            <div>
              <h4 className="text-white font-medium text-sm mb-4">Download Sample Templates</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-200">
              <div className="mb-3">
                <h4 className="text-white font-medium text-sm">Sales Data</h4>
                <p className="text-gray-400 text-xs">Revenue & customer insights</p>
              </div>
              <button className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200">
                Download CSV
              </button>
            </div>
            
            <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-200">
              <div className="mb-3">
                <h4 className="text-white font-medium text-sm">Support Tickets</h4>
                <p className="text-gray-400 text-xs">Customer service tracking</p>
              </div>
              <button className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200">
                Download CSV
              </button>
            </div>
            
            <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-lg p-4 hover:border-blue-500/50 transition-all duration-200">
              <div className="mb-3">
                <h4 className="text-white font-medium text-sm">Billing Data</h4>
                <p className="text-gray-400 text-xs">Payment & invoice tracking</p>
              </div>
              <button className="w-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-all duration-200">
                Download CSV
              </button>
              </div>
              </div>
            </div>
          </div>
          
          {/* Full-width Demo Limitation */}
          <div className="mt-2 border border-gray-600/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              {/* <div className="w-5 h-5 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-300 text-xs">ℹ️</span>
              </div> */}
                <div>
                  <p className="text-gray-300 text-sm">
                    <div className="font-medium">Demo Limitation:&nbsp;&nbsp;This environment accepts only the provided sample CSV files to ensure optimal demonstration. </div>
                    <span className="text-blue-300">The production version supports unlimited file types and can be fully customized to your specific business data, workflows, and requirements.</span>
                  </p>
                </div>
            </div>
          </div>
        </div>
        </div>
        )}
        
        {/* Stats Cards - 4 Individual Cards */}
       
        {/* Query Volume */}
        <DashboardCards />
      
     
      {/* Upload Area - Restricted to Sample Files */}
      <div className="mt-6 mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Add Data Source</h2>
          <p className="text-gray-400 text-sm mt-1">Upload CSV or SQL files to start analyzing your data</p>
        </div>
        <FileUpload 
          onFileUpload={async (file) => {
            console.log('File uploaded:', file.name);
            // Refresh data sources and tables after upload
            await fetchDataSources();
            await fetchTables();
          }}
        />
      </div>
     
      {/* Quick Insights - Tabbed Interface */}
      <div className="mb-8">
        {/* Dynamic Tab Buttons - Generated from uploaded tables */}
        <div className="mb-6">
          <div className="flex items-center space-x-2">
            {reorderedTables.map((table, index) => (
              <button
                key={table.table_name}
                onClick={() => handleTabChange(index)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 border rounded-lg ${
                  activeInsightTab === index
                    ? 'text-blue-400 border-blue-400 bg-blue-500/10'
                    : 'text-gray-400 border-gray-600/50 hover:text-gray-300 hover:border-gray-500/50 hover:bg-gray-700/20'
                }`}
              >
                {table.display_name || table.table_name}
              </button>
            ))}
            
            {/* Show message when no tables */}
            {tables.length === 0 && (
              <div>
                <h2 className="text-xl font-semibold text-white">Insights</h2>
                <p className="text-gray-400 text-sm mt-1">Upload data files to see dynamic insights</p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Tab Content */}
        {reorderedTables.length > 0 ? (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">
                {reorderedTables[activeInsightTab]?.display_name || reorderedTables[activeInsightTab]?.table_name || 'Data Insights'}
              </h3>
              <p className="text-sm text-gray-400">
                {reorderedTables[activeInsightTab]?.row_count || 0} records • Table: {reorderedTables[activeInsightTab]?.table_name}
              </p>
            </div>
            
            {renderDynamicTable()}
            
            <div className="mt-4 flex justify-end">
              <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">
                View All Data →
              </button>
            </div>
          </div>
        ) : (
          /* Empty State Table */
          <div className="bg-[#1a1a1a] border border-gray-600/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto scrollbar-dark">
              <table className="w-full border-collapse">
                <thead className="bg-[#262626] border-b border-gray-600/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap">Data Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center space-y-3">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <div>
                          <p className="text-white font-medium text-sm">No insights available yet</p>
                          <p className="text-gray-500 text-xs mt-1">Upload CSV or SQL files to see data insights</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions 
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-lg p-4 hover:border-blue-500/50 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-200">
              <ChartBarIcon className="h-4 w-4 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Generate Report</h3>
              <p className="text-gray-400 text-xs">Instant business insights</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-lg p-4 hover:border-indigo-500/50 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center group-hover:bg-indigo-500/30 transition-all duration-200">
              <EnvelopeIcon className="h-4 w-4 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">Schedule Reports</h3>
              <p className="text-gray-400 text-xs">Automated weekly insights</p>
            </div>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-lg p-4 hover:border-green-500/50 hover:shadow-md transition-all duration-200 cursor-pointer group">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-200">
              <LightBulbIcon className="h-4 w-4 text-green-400" />
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">AI Recommendations</h3>
              <p className="text-gray-400 text-xs">Smart business insights</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Data Sources List */}
      <div className="mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white">Data Sources</h2>
          <p className="text-gray-400 text-sm mt-1">Manage your uploaded business data</p>
        </div>
        
        <div className="bg-[#1a1a1a] border border-gray-600/50 rounded-xl overflow-hidden">
          <div className="overflow-x-auto scrollbar-dark">
            <table className="w-full border-collapse">
              <thead className="bg-[#262626] border-b border-gray-600/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title="Data source name">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title="File type (CSV, SQL, Excel)">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title="Number of records">Rows</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title="File size">Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title="Last updated date">Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider border-r border-gray-600/30 whitespace-nowrap" title="Processing status">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap" title="Available actions">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600/50">
                {filteredDataSources.length > 0 ? (
                  filteredDataSources.map((source) => {
                    const IconComponent = getIcon(source.type);
                    const StatusIconComponent = getStatusIcon(source.status);
                    return (
                      <tr key={source.id} className="hover:bg-gray-800/30 transition-colors duration-200">
                      <td className="px-6 py-4 border-r border-gray-600/30 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <IconComponent className="h-6 w-6 text-gray-400" />
                          <span className="text-white text-sm font-medium">{source.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-r border-gray-600/30 whitespace-nowrap">
                        <span className="text-gray-300 text-sm">{source.type}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-gray-600/30 whitespace-nowrap">
                        <span className="text-gray-300 text-sm">{source.rows.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-gray-600/30 whitespace-nowrap">
                        <span className="text-gray-300 text-sm">{source.size}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-gray-600/30 whitespace-nowrap">
                        <span className="text-gray-300 text-sm">{source.lastUpdated}</span>
                      </td>
                      <td className="px-6 py-4 border-r border-gray-600/30 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <StatusIconComponent className={`h-4 w-4 ${getStatusColor(source.status)}`} />
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            source.status === 'active' ? 'bg-green-500/20 text-green-300' :
                            source.status === 'processing' ? 'bg-yellow-500/20 text-yellow-300' :
                            'bg-red-500/20 text-red-300'
                          }`}>
                            {source.status.charAt(0).toUpperCase() + source.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <CircleStackIcon className="h-8 w-8 text-gray-500 mb-3" />
                        <div>
                          <p className="text-white font-medium text-sm">
                            {searchTerm ? 'No data sources match your search' : 'No data sources found'}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">Upload CSV or SQL files to get started</p>
                        </div>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm('')}
                            className="text-cyan-400 hover:text-cyan-300 mt-2 text-sm"
                          >
                            Clear search
                          </button>
                        )}
                        {!searchTerm && (
                          <p className="text-gray-500 text-xs mt-2">
                            Upload CSV or SQL files to get started
                          </p>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MyDataTab;