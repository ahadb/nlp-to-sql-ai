import React, { useState, useEffect } from 'react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
// import JSZip from 'jszip';
import { api } from '../services/api';
import TableInsightsCards from './TableInsightsCards';
import { mockTableInsights, type TableInsight } from '../data/mockTableInsights';

// interface TableData {
//   id: string;
//   name: string;
//   rows: number;
//   columns: number;
//   size: string;
//   lastUpdated: string;
//   status: 'active' | 'processing' | 'error';
// }

interface DataTablesTabProps {
  onOpenAIChat?: (templateMessage?: string, templates?: any[], tableName?: string) => void;
}

const DataTablesTab: React.FC<DataTablesTabProps> = ({ onOpenAIChat }) => {
  console.log('🎯 DataTablesTab component initializing...');
  
  const [tables, setTables] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [sortField, setSortField] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isLoading, setIsLoading] = useState(false);
  //const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [aiInsightsLoading, setAiInsightsLoading] = useState(false);
  const [showAIInsights, setShowAIInsights] = useState(true);
  const [apiInsights, setApiInsights] = useState<{
    insights: any[];
    patterns: any[];
    templates: any[];
  }>({ insights: [], patterns: [], templates: [] });

  // Function to download all CSV files as a zip
  // const handleDownloadAllCSV = async () => {
  //   try {
  //     const zip = new JSZip();
  //     const csvFiles = [
  //       'Artisan Craft - Billing.csv',
  //       'Artisan Craft - Sales.csv', 
  //       'Artisan Craft - Support.csv'
  //     ];

  //     // Fetch each CSV file and add to zip
  //     for (const fileName of csvFiles) {
  //       try {
  //         const response = await fetch(`/${fileName}`);
  //         if (response.ok) {
  //           const csvContent = await response.text();
  //           zip.file(fileName, csvContent);
  //         }
  //       } catch (error) {
  //         console.error(`Error fetching ${fileName}:`, error);
  //       }
  //     }

  //     // Generate and download the zip file
  //     const zipBlob = await zip.generateAsync({ type: 'blob' });
  //     const url = URL.createObjectURL(zipBlob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.download = 'sample-data.zip';
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error('Error creating zip file:', error);
  //   }
  // };

  // Get AI insights for current table
  const getCurrentTableInsights = () => {
    console.log('🔍 getCurrentTableInsights called with activeTab:', activeTab);
    
    if (!activeTab) {
      console.log('🔍 No activeTab, returning empty data');
      return { insights: [], patterns: [], templates: [] };
    }
    
    // Use API insights if available, otherwise fallback to mock data
    if (apiInsights.insights.length > 0 || apiInsights.patterns.length > 0 || apiInsights.templates.length > 0) {
      console.log('🔍 Using API insights for', activeTab, ':', apiInsights);
      return apiInsights;
    }
    
    // Fallback to mock data with proper mapping
    const getMockTableName = (name: string) => {
      const lowerName = name.toLowerCase();
      if (lowerName.includes('sales')) return 'sales_data';
      if (lowerName.includes('billing')) return 'billing_data';
      if (lowerName.includes('support')) return 'support_data';
      return name; // Use original name for unknown tables
    };
    
    const mockTableName = getMockTableName(activeTab);
    const result = mockTableInsights[mockTableName] || { insights: [], patterns: [], templates: [] };
    console.log('🔍 Using mock insights for', activeTab, '->', mockTableName, ':', result);
    return result;
  };

  // Fetch AI insights from API
  const fetchTableInsights = async (tableName: string) => {
    try {
      console.log('🚀 Starting API call for table:', tableName);
      setAiInsightsLoading(true);
      
      // Map table names to API-friendly names
      const getApiTableName = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('sales')) return 'sales_data';
        if (lowerName.includes('billing')) return 'billing_data';
        if (lowerName.includes('support')) return 'support_data';
        return name; // Use original name for unknown tables
      };
      
      const apiTableName = getApiTableName(tableName);
      console.log('🔄 Mapped table name:', tableName, '->', apiTableName);
      
      const response = await api.getDataInsights(apiTableName);
      console.log('📊 API insights response:', response);
      
      // Transform API response to match TableInsight interface
      const transformInsight = (item: any, type: 'insight' | 'pattern' | 'template') => {
        if (type === 'template') {
          return {
            id: `template-${item.title?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substr(2, 9)}`,
            title: item.title || 'Untitled Template',
            value: item.category || 'Query Template',
            change: '',
            changeType: 'neutral' as const,
            description: item.description || 'No description available',
            sparkline: [],
            type: 'template' as const
          };
        }
        
        return {
          id: `${type}-${item.title?.toLowerCase().replace(/\s+/g, '-') || Math.random().toString(36).substr(2, 9)}`,
          title: item.title || 'Untitled',
          value: item.metric || item.value || 'N/A',
          change: item.change || '0%',
          changeType: item.trend === 'up' ? 'positive' : item.trend === 'down' ? 'negative' : 'neutral',
          description: item.description || 'No description available',
          sparkline: item.data_points || [],
          type: type
        };
      };

      const transformedInsights = (response.insights || []).map((item: any) => transformInsight(item, 'insight'));
      const transformedPatterns = (response.patterns || []).map((item: any) => transformInsight(item, 'pattern'));
      const transformedTemplates = (response.templates || []).map((item: any) => transformInsight(item, 'template'));
      
      setApiInsights({
        insights: transformedInsights.length > 0 ? transformedInsights : [],
        patterns: transformedPatterns.length > 0 ? transformedPatterns : [],
        templates: transformedTemplates.length > 0 ? transformedTemplates : []
      });
      
      console.log('✅ API insights stored in state:', {
        insights: response.insights?.length || 0,
        patterns: response.patterns?.length || 0,
        templates: response.templates?.length || 0
      });
      
      console.log('🔄 Transformed insights:', {
        insights: transformedInsights,
        patterns: transformedPatterns,
        templates: transformedTemplates
      });
      
      console.log('📋 Raw templates from API:', response.templates);
      
      return response;
    } catch (error) {
      console.error('❌ Failed to fetch table insights:', error);
      console.error('❌ Error details:', error);
      // Clear API insights on error to fallback to mock data
      setApiInsights({ insights: [], patterns: [], templates: [] });
      return getCurrentTableInsights();
    } finally {
      setAiInsightsLoading(false);
    }
  };

  // Handle template click
  const handleTemplateClick = (template: TableInsight) => {
    console.log('Template clicked:', template.title);
    
    // Create a template message based on the template and current table
    const currentTable = getCurrentTable();
    const tableName = currentTable?.table_name || 'this table';
    
    // Generate contextual message based on template title - make them table-specific
    let templateMessage = '';
    if (template.title.toLowerCase().includes('sales data analysis')) {
      templateMessage = `Show me comprehensive sales data analysis for sales_precise_test including performance trends and key metrics`;
    } else if (template.title.toLowerCase().includes('customer insights')) {
      templateMessage = `Analyze customer behavior and purchasing patterns in sales_precise_test`;
    } else if (template.title.toLowerCase().includes('revenue optimization')) {
      templateMessage = `Identify revenue optimization opportunities in sales_precise_test`;
    } else if (template.title.toLowerCase().includes('billing data analysis')) {
      templateMessage = `Analyze billing patterns, payment trends, and financial health in billing_precise_test`;
    } else if (template.title.toLowerCase().includes('payment insights')) {
      templateMessage = `Deep dive into payment behavior and collection patterns in billing_precise_test`;
    } else if (template.title.toLowerCase().includes('financial optimization')) {
      templateMessage = `Identify opportunities to improve cash flow and reduce risk in billing_precise_test`;
    } else if (template.title.toLowerCase().includes('support data analysis')) {
      templateMessage = `Analyze support ticket performance, response times, and resolution patterns in support_precise_test`;
    } else if (template.title.toLowerCase().includes('customer experience')) {
      templateMessage = `Deep dive into customer satisfaction and feedback trends in support_precise_test`;
    } else if (template.title.toLowerCase().includes('support optimization')) {
      templateMessage = `Identify opportunities to improve support efficiency and quality in support_precise_test`;
    } else {
      // Generic fallback
      templateMessage = `Analyze ${template.title.toLowerCase()} in ${tableName}`;
    }
    
    console.log('Generated template message:', templateMessage);
    
    if (onOpenAIChat) {
      // Get current table templates and schema_id (not table_name)
      const currentTemplates = getCurrentTableInsights().templates;
      const currentTable = getCurrentTable();
      const schemaId = currentTable?.schema_id || null;
      onOpenAIChat(templateMessage, currentTemplates, schemaId);
    }
  };

  // Fetch tables from backend
  const fetchTables = async () => {
    console.log('🔍 Fetching tables from /tables endpoint...');
    try {
      setIsLoading(true);
      const response = await api.getTables();
      console.log('📊 Tables response:', response);
      setTables(response.tables || []);
      
      // Set first table as active tab
      if (response.tables && response.tables.length > 0) {
        setActiveTab(response.tables[0].table_name);
        console.log('✅ Set active tab to:', response.tables[0].table_name);
      }
    } catch (error) {
      console.error('❌ Failed to fetch tables:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load tables on component mount
  useEffect(() => {
    console.log('🚀 DataTablesTab mounted, calling fetchTables...');
    fetchTables();
  }, []);

  // Fetch insights when active tab changes
  useEffect(() => {
    console.log('🔄 useEffect triggered - activeTab:', activeTab, 'tables.length:', tables.length);
    if (activeTab) {
      console.log('🔄 Active tab changed to:', activeTab, 'fetching insights...');
      // Clear previous insights immediately to show loading state
      setApiInsights({ insights: [], patterns: [], templates: [] });
      fetchTableInsights(activeTab);
    } else {
      console.log('🔄 No active tab, skipping insights fetch');
    }
  }, [activeTab]);

  // Get AI-generated insights for current table
  // const getTableInsights = (tableName: string, rowCount: number) => {
  //   const insights = {
  //     sales: [
  //       `${rowCount} sales records analyzed`,
  //       `Revenue growth trend detected`,
  //       `Top customer segment identified`,
  //       `3 high-value customers need attention`
  //     ],
  //     support: [
  //       `${rowCount} support tickets analyzed`,
  //       `Average resolution time: 2.3 hours`,
  //       `Customer satisfaction: 89%`,
  //       `5 critical tickets require immediate action`
  //     ],
  //     customers: [
  //       `${rowCount} customer profiles analyzed`,
  //       `Customer lifetime value: $2,847 avg`,
  //       `Retention rate: 87% (above industry avg)`,
  //       `12 customers ready for upselling`
  //     ],
  //     default: [
  //       `${rowCount} records analyzed`,
  //       `Data quality score: 94%`,
  //       `Key patterns identified`,
  //       `Business opportunities detected`
  //     ]
  //   };

  //   const tableKey = tableName.toLowerCase().includes('sales') ? 'sales' :
  //                   tableName.toLowerCase().includes('support') ? 'support' :
  //                   tableName.toLowerCase().includes('customer') ? 'customers' : 'default';
    
  //   return insights[tableKey as keyof typeof insights];
  // };

  // Get smart query suggestions based on current context
  // const getSmartSuggestions = (tableName: string, selectedCount: number) => {
  //   const baseQueries = {
  //     sales: [
  //       "Analyze revenue trends by month",
  //       "Find top performing products",
  //       "Identify at-risk customers",
  //       "Calculate customer lifetime value"
  //     ],
  //     support: [
  //       "Show ticket resolution patterns", 
  //       "Find common support issues",
  //       "Analyze customer satisfaction trends",
  //       "Identify support bottlenecks"
  //     ],
  //     customers: [
  //       "Segment customers by behavior",
  //       "Find churn risk indicators", 
  //       "Analyze customer demographics",
  //       "Identify expansion opportunities"
  //     ],
  //     default: [
  //       "Summarize key findings",
  //       "Find data anomalies",
  //       "Identify trends and patterns",
  //       "Generate business insights"
  //     ]
  //   };

  //   const tableKey = tableName.toLowerCase().includes('sales') ? 'sales' :
  //                   tableName.toLowerCase().includes('support') ? 'support' :
  //                   tableName.toLowerCase().includes('customer') ? 'customers' : 'default';
    
  //   let suggestions = baseQueries[tableKey as keyof typeof baseQueries];
    
  //   // Add context-aware suggestions based on selection
  //   if (selectedCount > 0) {
  //     suggestions = [
  //       `Analyze these ${selectedCount} selected records`,
  //       `Compare selected vs unselected data`,
  //       ...suggestions.slice(0, 2)
  //     ];
  //   }
    
  //   return suggestions;
  // };

  // Get available AI query templates for current table
  // const getAITemplates = (tableName: string) => {
  //   const lowerName = tableName.toLowerCase();
    
  //   if (lowerName.includes('sales')) {
  //     return [
  //       { category: "Revenue Analysis", queries: [
  //         "Show top 10 customers by revenue",
  //         "Calculate monthly revenue trends",
  //         "Find highest value transactions",
  //         "Identify revenue growth opportunities"
  //       ]},
  //       { category: "Customer Intelligence", queries: [
  //         "Analyze customer lifetime value",
  //         "Find customers at risk of churning",
  //         "Segment customers by purchase behavior",
  //         "Identify upselling opportunities"
  //       ]},
  //       { category: "Product Performance", queries: [
  //         "Show best performing products",
  //         "Analyze product profitability",
  //         "Find slow-moving inventory",
  //         "Identify cross-sell opportunities"
  //       ]}
  //     ];
  //   } else if (lowerName.includes('billing')) {
  //     return [
  //       { category: "Financial Analysis", queries: [
  //         "Show outstanding invoices over 30 days",
  //         "Calculate average payment time",
  //         "Find customers with payment delays",
  //         "Analyze payment patterns by customer"
  //       ]},
  //       { category: "Collections", queries: [
  //         "Identify high-risk accounts",
  //         "Show overdue amounts by customer",
  //         "Find customers with credit issues",
  //         "Analyze collection success rates"
  //       ]}
  //     ];
  //   } else if (lowerName.includes('support')) {
  //     return [
  //       { category: "Performance Analysis", queries: [
  //         "Show tickets with longest resolution time",
  //         "Calculate average response time",
  //         "Find most common support issues",
  //         "Analyze agent performance metrics"
  //       ]},
  //       { category: "Customer Satisfaction", queries: [
  //         "Show customer satisfaction trends",
  //         "Find tickets with low ratings",
  //         "Analyze escalation patterns",
  //         "Identify improvement opportunities"
  //       ]},
  //       { category: "Operations", queries: [
  //         "Show critical unresolved tickets",
  //         "Find support bottlenecks",
  //         "Analyze ticket volume trends",
  //         "Identify training needs"
  //       ]}
  //     ];
  //   } else {
  //     return [
  //       { category: "Data Analysis", queries: [
  //         "Summarize key findings",
  //         "Find data anomalies",
  //         "Identify trends and patterns",
  //         "Generate business insights"
  //       ]},
  //       { category: "Quality Assessment", queries: [
  //         "Analyze data completeness",
  //         "Find duplicate records",
  //         "Check data consistency",
  //         "Identify data quality issues"
  //       ]}
  //     ];
  //   }
  // };

  // Get current table data
  const getCurrentTable = () => {
    return tables.find(table => table.table_name === activeTab);
  };

  // Get AI-powered insights metrics
  // const getTableMetrics = (tableName: string, rowCount: number) => {
  //   const lowerName = tableName.toLowerCase();
    
  //   if (lowerName.includes('sales')) {
  //     return [
  //       { label: "Insights", value: "6", color: "text-blue-400" },
  //       { label: "Patterns", value: "3", color: "text-purple-400" },
  //       { label: "Templates", value: "12", color: "text-cyan-400" }
  //     ];
  //   } else if (lowerName.includes('billing')) {
  //     return [
  //       { label: "Insights", value: "4", color: "text-blue-400" },
  //       { label: "Patterns", value: "2", color: "text-purple-400" },
  //       { label: "Templates", value: "8", color: "text-cyan-400" }
  //     ];
  //   } else if (lowerName.includes('support')) {
  //     return [
  //       { label: "Insights", value: "5", color: "text-blue-400" },
  //       { label: "Patterns", value: "2", color: "text-purple-400" },
  //       { label: "Templates", value: "10", color: "text-cyan-400" }
  //     ];
  //   } else {
  //     // Default metrics for unknown tables
  //     return [
  //       { label: "Insights", value: "8", color: "text-blue-400" },
  //       { label: "Patterns", value: "4", color: "text-purple-400" },
  //       { label: "Templates", value: "15", color: "text-cyan-400" }
  //     ];
  //   }
  // };

  // Dynamic table renderer
  const renderDynamicTable = () => {
    const currentTable = getCurrentTable();
    
    if (!currentTable) {
      return (
        <div className="p-8 text-center">
          <p className="text-gray-400">
            {isLoading ? 'Loading tables...' : 'No tables available. Upload some data to get started.'}
          </p>
        </div>
      );
    }

    const data = currentTable.sample_data || [];
    
    return (
      <table className="w-full">
        <thead className="bg-[#262626] border-b border-gray-600/30">
          <tr>
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="appearance-none w-4 h-4 bg-[#262626] border border-gray-500 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                style={{
                  backgroundImage: selectAll ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z\'/%3e%3c/svg%3e")' : 'none'
                }}
              />
            </th>
            {currentTable.columns.map((column: any) => (
              <th key={column.name} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">
                <button 
                  onClick={() => handleSort(column.name)} 
                  className="flex items-center hover:text-gray-300 transition-colors duration-200 whitespace-nowrap"
                >
                  {column.name.replace('_', ' ')} {getSortIcon(column.name)}
                </button>
              </th>
            ))}
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/30">
          {data.map((row: any, index: number) => (
            <tr key={index} className="hover:bg-gray-800/30 transition-colors duration-200">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selectedRows.has(index)}
                  onChange={() => handleRowSelect(index)}
                  className="appearance-none w-4 h-4 bg-[#262626] border border-gray-500 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  style={{
                    backgroundImage: selectedRows.has(index) ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z\'/%3e%3c/svg%3e")' : 'none'
                  }}
                />
              </td>
              {currentTable.columns.map((column: any) => (
                <td key={column.name} className="px-4 py-3 text-sm text-gray-300 whitespace-nowrap">
                  {formatCellValue(row[column.name], column.type)}
                </td>
              ))}
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200">
                    <EyeIcon className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all duration-200">
                    <PencilIcon className="h-3.5 w-3.5" />
                  </button>
                  <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200">
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Format cell values based on column type
  const formatCellValue = (value: any, columnType: string) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-500">—</span>;
    }
    
    // Format based on PostgreSQL data type
    if (columnType.includes('numeric') || columnType.includes('decimal') || columnType.includes('money')) {
      return <span className="text-green-400 font-medium">${parseFloat(value).toLocaleString()}</span>;
    }
    
    if (columnType.includes('integer') || columnType.includes('bigint')) {
      return <span className="text-blue-400">{parseInt(value).toLocaleString()}</span>;
    }
    
    if (columnType.includes('timestamp') || columnType.includes('date')) {
      return <span className="text-purple-400">{new Date(value).toLocaleDateString()}</span>;
    }
    
    return <span className="text-white">{String(value)}</span>;
  };

  // Get current table data for row operations
  const getCurrentTableData = () => {
    const currentTable = getCurrentTable();
    return currentTable?.sample_data || [];
  };

  /* 
  // REMOVED: All mock data generation functions - using real data from /tables endpoint now
  const generateCustomers = () => {
    const companies = ['Acme Corp', 'TechStart Inc', 'Global Solutions', 'Innovation Labs', 'Future Systems', 'Digital Dynamics', 'Smart Solutions', 'NextGen Tech', 'Quantum Corp', 'Alpha Industries', 'Beta Systems', 'Gamma Tech', 'Delta Corp', 'Epsilon Labs', 'Zeta Solutions', 'Theta Innovations', 'Lambda Systems', 'Omega Corp', 'Sigma Tech', 'Phoenix Industries', 'Titan Corp', 'Atlas Solutions', 'Mercury Tech', 'Venus Systems', 'Mars Corp', 'Jupiter Labs', 'Saturn Solutions', 'Neptune Tech', 'Uranus Corp', 'Pluto Systems'];
    const domains = ['com', 'io', 'net', 'org', 'co', 'tech', 'ai', 'app'];
    const statuses = ['Active', 'Pending', 'Inactive'];
    const data = [];
    
    for (let i = 1; i <= 250; i++) {
      const company = companies[Math.floor(Math.random() * companies.length)];
      const domain = domains[Math.floor(Math.random() * domains.length)];
      const revenue = Math.floor(Math.random() * 100000) + 5000;
      const orders = Math.floor(Math.random() * 50) + 1;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const joinDate = new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      
      data.push({
        id: i,
        name: `${company} ${i > 30 ? i : ''}`.trim(),
        email: `contact${i}@${company.toLowerCase().replace(/\s+/g, '')}.${domain}`,
        revenue: `$${revenue.toLocaleString()}`,
        orders: orders,
        status: status,
        joinDate: joinDate
      });
    }
    return data;
  };

  const generateOrders = () => {
    const customers = ['Acme Corp', 'TechStart Inc', 'Global Solutions', 'Innovation Labs', 'Future Systems', 'Digital Dynamics', 'Smart Solutions', 'NextGen Tech', 'Quantum Corp', 'Alpha Industries'];
    const products = ['Enterprise Plan', 'Professional Plan', 'Business Plan', 'Startup Plan', 'Premium Plan', 'Basic Plan', 'Advanced Plan', 'Custom Plan'];
    const statuses = ['Completed', 'Processing', 'Pending', 'Cancelled', 'Refunded'];
    const data = [];
    
    for (let i = 1; i <= 300; i++) {
      const customer = customers[Math.floor(Math.random() * customers.length)];
      const product = products[Math.floor(Math.random() * products.length)];
      const value = Math.floor(Math.random() * 25000) + 1000;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const date = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      
      data.push({
        id: i,
        orderId: `#ORD-2024-${String(i).padStart(3, '0')}`,
        customer: customer,
        product: product,
        value: `$${value.toLocaleString()}`,
        date: date,
        status: status
      });
    }
    return data;
  };

  const generateProducts = () => {
    const categories = ['Software', 'Hardware', 'Service', 'Consulting', 'Training', 'Support'];
    const plans = ['Enterprise', 'Professional', 'Business', 'Startup', 'Premium', 'Basic', 'Advanced', 'Custom', 'Trial', 'Student'];
    const types = ['Plan', 'Package', 'Suite', 'Solution', 'Service', 'Tool', 'Platform', 'System'];
    const statuses = ['Active', 'Discontinued', 'Beta', 'Coming Soon'];
    const data = [];
    
    for (let i = 1; i <= 200; i++) {
      const plan = plans[Math.floor(Math.random() * plans.length)];
      const type = types[Math.floor(Math.random() * types.length)];
      const category = categories[Math.floor(Math.random() * categories.length)];
      const price = Math.floor(Math.random() * 500) + 10;
      const sales = Math.floor(Math.random() * 1000) + 1;
      const revenue = price * sales;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      data.push({
        id: i,
        name: `${plan} ${type}${i > 10 ? ` v${i}` : ''}`,
        category: category,
        price: `$${price}/mo`,
        sales: sales,
        revenue: `$${revenue.toLocaleString()}`,
        status: status
      });
    }
    return data;
  };

  const generateAnalytics = () => {
    const metrics = ['Page Views', 'Unique Visitors', 'Conversion Rate', 'Avg Session Duration', 'Bounce Rate', 'Click-Through Rate', 'Revenue per Visitor', 'Cart Abandonment', 'Email Open Rate', 'Social Engagement', 'Mobile Traffic', 'Desktop Traffic', 'Organic Traffic', 'Paid Traffic', 'Direct Traffic', 'Referral Traffic', 'Return Visitors', 'New Visitors', 'Time on Site', 'Pages per Session'];
    const periods = ['This month', 'Last month', 'This week', 'Last week', 'Today', 'Yesterday'];
    const trends = ['up', 'down', 'neutral'];
    const data = [];
    
    for (let i = 1; i <= 250; i++) {
      const metric = i <= metrics.length ? metrics[i-1] : `${metrics[Math.floor(Math.random() * metrics.length)]} ${i}`;
      const value = Math.floor(Math.random() * 1000000) + 100;
      const change = (Math.random() * 40 - 20).toFixed(1); // -20% to +20%
      const period = periods[Math.floor(Math.random() * periods.length)];
      const trend = parseFloat(change) > 0 ? 'up' : parseFloat(change) < 0 ? 'down' : 'neutral';
      
      data.push({
        id: i,
        metric: metric,
        value: value.toLocaleString(),
        change: `${change > 0 ? '+' : ''}${change}%`,
        period: period,
        trend: trend
      });
    }
    return data;
  };
  */

  const handleSelectAll = () => {
    const currentData = getCurrentTableData();
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set<number>(currentData.map((_: any, index: number) => index));
      setSelectedRows(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (index: number) => {
    const currentData = getCurrentTableData();
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === currentData.length);
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

  // const renderCustomersTable = () => (
  //   <table className="w-full">
  //     <thead className="bg-[#262626] border-b border-gray-600/30">
  //       <tr>
  //         <th className="px-4 py-3 text-left">
  //           <input
  //             type="checkbox"
  //             checked={selectAll}
  //             onChange={handleSelectAll}
  //             className="appearance-none w-4 h-4 bg-[#262626] border border-gray-500 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
  //             style={{
  //               backgroundImage: selectAll ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z\'/%3e%3c/svg%3e")' : 'none'
  //             }}
  //           />
  //         </th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
  //           <button 
  //             onClick={() => handleSort('name')} 
  //             className="flex items-center hover:text-gray-300 transition-colors duration-200"
  //           >
  //             Customer {getSortIcon('name')}
  //           </button>
  //         </th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
  //           <button 
  //             onClick={() => handleSort('email')} 
  //             className="flex items-center hover:text-gray-300 transition-colors duration-200"
  //           >
  //             Email {getSortIcon('email')}
  //           </button>
  //         </th>
  //         <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
  //           <button 
  //             onClick={() => handleSort('revenue')} 
  //             className="flex items-center hover:text-gray-300 transition-colors duration-200 ml-auto"
  //           >
  //             Revenue {getSortIcon('revenue')}
  //           </button>
  //         </th>
  //         <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
  //           <button 
  //             onClick={() => handleSort('orders')} 
  //             className="flex items-center hover:text-gray-300 transition-colors duration-200 ml-auto"
  //           >
  //             Orders {getSortIcon('orders')}
  //           </button>
  //         </th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
  //           <button 
  //             onClick={() => handleSort('status')} 
  //             className="flex items-center hover:text-gray-300 transition-colors duration-200"
  //           >
  //             Status {getSortIcon('status')}
  //           </button>
  //         </th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
  //           <button 
  //             onClick={() => handleSort('joinDate')} 
  //             className="flex items-center hover:text-gray-300 transition-colors duration-200"
  //           >
  //             Join Date {getSortIcon('joinDate')}
  //           </button>
  //         </th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
  //       </tr>
  //     </thead>
  //     <tbody className="divide-y divide-gray-700/30">
  //       {getCurrentTableData().map((row: any, index: number) => (
  //         <tr key={row.id} className="hover:bg-gray-800/30 transition-colors duration-200">
  //           <td className="px-4 py-3">
  //             <input
  //               type="checkbox"
  //               checked={selectedRows.has(index)}
  //               onChange={() => handleRowSelect(index)}
  //               className="appearance-none w-4 h-4 bg-[#262626] border border-gray-500 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
  //               style={{
  //                 backgroundImage: selectedRows.has(index) ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z\'/%3e%3c/svg%3e")' : 'none'
  //               }}
  //             />
  //           </td>
  //           <td className="px-4 py-3 text-sm text-white font-medium">{row.name}</td>
  //           <td className="px-4 py-3 text-sm text-gray-300">{row.email}</td>
  //           <td className="px-4 py-3 text-sm text-green-400 text-right font-medium">{row.revenue}</td>
  //           <td className="px-4 py-3 text-sm text-white text-right">{row.orders}</td>
  //           <td className="px-4 py-3">
  //             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
  //               row.status === 'Active' 
  //                 ? 'bg-green-500/20 text-green-300' 
  //                 : 'bg-amber-500/20 text-amber-300'
  //             }`}>
  //               {row.status}
  //             </span>
  //           </td>
  //           <td className="px-4 py-3 text-sm text-gray-300">{row.joinDate}</td>
  //           <td className="px-4 py-3">
  //             <div className="flex items-center space-x-1">
  //               <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200">
  //                 <EyeIcon className="h-3.5 w-3.5" />
  //               </button>
  //               <button className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all duration-200">
  //                 <PencilIcon className="h-3.5 w-3.5" />
  //               </button>
  //               <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200">
  //                 <TrashIcon className="h-3.5 w-3.5" />
  //               </button>
  //             </div>
  //           </td>
  //         </tr>
  //       ))}
  //     </tbody>
  //   </table>
  // );

  // const renderOrdersTable = () => (
  //   <table className="w-full">
  //     <thead className="bg-[#262626] border-b border-gray-600/30">
  //       <tr>
  //         <th className="px-4 py-3 text-left">
  //           <input
  //             type="checkbox"
  //             checked={selectAll}
  //             onChange={handleSelectAll}
  //             className="appearance-none w-4 h-4 bg-[#262626] border border-gray-500 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
  //             style={{
  //               backgroundImage: selectAll ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z\'/%3e%3c/svg%3e")' : 'none'
  //             }}
  //           />
  //         </th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
  //         <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Value</th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
  //       </tr>
  //     </thead>
  //     <tbody className="divide-y divide-gray-700/30">
  //       {getCurrentTableData().map((row: any, index: number) => (
  //         <tr key={row.id} className="hover:bg-gray-800/30 transition-colors duration-200">
  //           <td className="px-4 py-3">
  //             <input
  //               type="checkbox"
  //               checked={selectedRows.has(index)}
  //               onChange={() => handleRowSelect(index)}
  //               className="appearance-none w-4 h-4 bg-[#262626] border border-gray-500 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
  //               style={{
  //                 backgroundImage: selectedRows.has(index) ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z\'/%3e%3c/svg%3e")' : 'none'
  //               }}
  //             />
  //           </td>
  //           <td className="px-4 py-3 text-sm text-white font-medium">{row.orderId}</td>
  //           <td className="px-4 py-3 text-sm text-white">{row.customer}</td>
  //           <td className="px-4 py-3 text-sm text-gray-300">{row.product}</td>
  //           <td className="px-4 py-3 text-sm text-green-400 text-right font-medium">{row.value}</td>
  //           <td className="px-4 py-3 text-sm text-gray-300">{row.date}</td>
  //           <td className="px-4 py-3">
  //             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
  //               row.status === 'Completed' 
  //                 ? 'bg-green-500/20 text-green-300' 
  //                 : 'bg-amber-500/20 text-amber-300'
  //             }`}>
  //               {row.status}
  //             </span>
  //           </td>
  //           <td className="px-4 py-3">
  //             <div className="flex items-center space-x-1">
  //               <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200">
  //                 <EyeIcon className="h-3.5 w-3.5" />
  //               </button>
  //               <button className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all duration-200">
  //                 <PencilIcon className="h-3.5 w-3.5" />
  //               </button>
  //               <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200">
  //                 <TrashIcon className="h-3.5 w-3.5" />
  //               </button>
  //             </div>
  //           </td>
  //         </tr>
  //       ))}
  //     </tbody>
  //   </table>
  // );

  // const renderGenericTable = () => (
  //   <table className="w-full">
  //     <thead className="bg-[#262626] border-b border-gray-600/30">
  //       <tr>
  //         <th className="px-4 py-3 text-left">
  //           <input
  //             type="checkbox"
  //             checked={selectAll}
  //             onChange={handleSelectAll}
  //             className="appearance-none w-4 h-4 bg-[#262626] border border-gray-500 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
  //             style={{
  //               backgroundImage: selectAll ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z\'/%3e%3c/svg%3e")' : 'none'
  //             }}
  //           />
  //         </th>
  //         {Object.keys(getCurrentTableData()[0] || {}).filter(key => key !== 'id').map((key) => (
  //           <th key={key} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
  //             {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
  //           </th>
  //         ))}
  //         <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
  //       </tr>
  //     </thead>
  //     <tbody className="divide-y divide-gray-700/30">
  //       {getCurrentTableData().map((row: any, index: number) => (
  //         <tr key={row.id} className="hover:bg-gray-800/30 transition-colors duration-200">
  //           <td className="px-4 py-3">
  //             <input
  //               type="checkbox"
  //               checked={selectedRows.has(index)}
  //               onChange={() => handleRowSelect(index)}
  //               className="appearance-none w-4 h-4 bg-[#262626] border border-gray-500 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
  //               style={{
  //                 backgroundImage: selectedRows.has(index) ? 'url("data:image/svg+xml,%3csvg viewBox=\'0 0 16 16\' fill=\'white\' xmlns=\'http://www.w3.org/2000/svg\'%3e%3cpath d=\'m13.854 3.646-7.5 7.5a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6 10.293l7.146-7.147a.5.5 0 0 1 .708.708z\'/%3e%3c/svg%3e")' : 'none'
  //               }}
  //             />
  //           </td>
  //           {Object.entries(row).filter(([key]) => key !== 'id').map(([key, value]) => (
  //             <td key={key} className={`px-4 py-3 text-sm ${
  //               key === 'revenue' || key === 'value' ? 'text-green-400 text-right font-medium' :
  //               key === 'status' ? '' :
  //               key === 'name' || key === 'orderId' ? 'text-white font-medium' :
  //               'text-gray-300'
  //             }`}>
  //               {key === 'status' ? (
  //                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
  //                   value === 'Active' || value === 'Completed' 
  //                     ? 'bg-green-500/20 text-green-300' 
  //                     : 'bg-amber-500/20 text-amber-300'
  //                 }`}>
  //                   {value as string}
  //                 </span>
  //               ) : (
  //                 value as string
  //               )}
  //             </td>
  //           ))}
  //           <td className="px-4 py-3">
  //             <div className="flex items-center space-x-1">
  //               <button className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded transition-all duration-200">
  //                 <EyeIcon className="h-3.5 w-3.5" />
  //               </button>
  //               <button className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-green-500/10 rounded transition-all duration-200">
  //                 <PencilIcon className="h-3.5 w-3.5" />
  //               </button>
  //               <button className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded transition-all duration-200">
  //                 <TrashIcon className="h-3.5 w-3.5" />
  //               </button>
  //             </div>
  //           </td>
  //         </tr>
  //       ))}
  //     </tbody>
  //   </table>
  // );

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="pt-12 px-6 pb-6 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Data Tables</h1>
            <p className="text-gray-400">Explore and manage your business data</p>
          </div>
        </div>

        {/* Load Data Badge */}
        <div className="mb-6">
          <div className="bg-indigo-500/10 border border-indigo-400/30 rounded-xl p-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">This Tab is AI Enabled</h3>
              <p className="text-gray-300 text-sm">Experience AI-powered insights and analysis in the cards below - click on any template to start a conversation with our AI assistant and explore your data through natural language queries. All insights are generated using LLMs to provide meaningful business intelligence. Some features are disabled on this tab.</p>
            </div>
          </div>
        </div>

        {/* Search Bar with Filter and Export buttons */}
        <div className="flex items-center space-x-3">
          <div className="relative w-80">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#262626] border border-gray-600/50 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            />
          </div>
          <button className="flex items-center space-x-2 px-3 py-2 border border-gray-600/50 text-gray-300 hover:text-white hover:border-gray-500 text-sm rounded-lg transition-colors duration-200">
            <FunnelIcon className="h-4 w-4" />
            <span>Filter</span>
          </button>
          <button 
            // onClick={handleDownloadAllCSV}
            className="flex items-center space-x-2 px-3 py-2 border border-blue-600 text-blue-400 hover:bg-blue-600 hover:text-white text-sm rounded-lg transition-colors duration-200"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            <span>Export</span>
          </button>
          {/* <div className="flex items-center space-x-2 text-xs text-gray-400">
            <InformationCircleIcon className="h-4 w-4" />
            <span>Viewing sample data - AI analyzes this dataset. Download to see our pre-loading data.</span>
          </div> */}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-700/50">
        <div className="flex items-center px-6 py-0">
          {tables.map((table) => (
            <button
              key={table.table_name}
              onClick={() => setActiveTab(table.table_name)}
              className={`px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 ${
                activeTab === table.table_name
                  ? 'text-blue-400 border-blue-400'
                  : 'text-gray-400 border-transparent hover:text-gray-300'
              }`}
            >
              {table.display_name}
            </button>
          ))}
        </div>
      </div>

      {/* AI Data Intelligence Section */}
      {activeTab && (
        <div className="mx-6 mt-6 mb-4">
          <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <SparklesIcon className="h-6 w-6 text-blue-400" />
                <h3 className="text-xl font-semibold text-white">AI Data Intelligence</h3>
                <div className="bg-gray-800/30 border border-gray-600/30 rounded-lg px-3 py-1.5">
                  <span className="text-gray-400 text-xs">Records Analyzed:</span>
                  <span className="text-white font-medium text-sm ml-1">{(getCurrentTable()?.row_count || 0).toLocaleString()}</span>
                </div>
                
                {selectedRows.size > 0 && (
                  <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-1.5 flex items-center space-x-2">
                    <span className="text-blue-300 text-xs">Selected Rows:</span>
                    <span className="text-blue-200 font-medium text-sm">
                      {selectedRows.size} of {(getCurrentTable()?.row_count || 0).toLocaleString()}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRows(new Set());
                        setSelectAll(false);
                      }}
                      className="text-blue-300 hover:text-blue-200 transition-colors"
                      title="Clear selected rows"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowAIInsights(!showAIInsights)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-600/30 rounded-lg transition-colors"
                >
                  <span className="text-sm text-gray-300">
                    {showAIInsights ? 'Hide' : 'Show'} AI Insights
                  </span>
                  {showAIInsights ? (
                    <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                  )}
                </button>

                <button 
                  onClick={() => {
                    console.log('🔄 Manual refresh clicked for tab:', activeTab);
                    if (activeTab) {
                      // Clear current insights first
                      setApiInsights({ insights: [], patterns: [], templates: [] });
                      fetchTableInsights(activeTab);
                    }
                  }}
                  disabled={aiInsightsLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-800/30 hover:bg-gray-700/50 border border-gray-600/30 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg 
                    className={`h-4 w-4 text-gray-400 ${aiInsightsLoading ? 'animate-spin' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span className="text-sm text-gray-300">
                    {aiInsightsLoading ? 'Refreshing...' : 'Refresh'}
                  </span>
                </button>
                
                <button 
                  onClick={() => {
                    if (onOpenAIChat) {
                      const currentTemplates = getCurrentTableInsights().templates;
                      const currentTable = getCurrentTable();
                      const schemaId = currentTable?.schema_id || null;
                      onOpenAIChat(undefined, currentTemplates, schemaId);
                    }
                  }}
                  className="border border-orange-400 text-orange-400 px-4 py-2 rounded-lg hover:border-orange-300 hover:text-orange-300 hover:bg-orange-500/10 transition-all duration-200 group flex items-center space-x-2 cursor-pointer"
                >
                  <SparklesIcon className="h-4 w-4 text-orange-400 group-hover:scale-110 transition-transform duration-200" />
                  <span className="font-medium text-sm">Ask AI</span>
                </button>
              </div>
            </div>
            
            {showAIInsights && (
              <div>
                {aiInsightsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex items-center space-x-3">
                      <svg 
                        className="h-6 w-6 text-blue-400 animate-spin" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="text-gray-300 text-sm">AI is analyzing your data...</span>
                    </div>
                  </div>
                ) : (
                  <TableInsightsCards
                    insights={getCurrentTableInsights().insights}
                    patterns={getCurrentTableInsights().patterns}
                    templates={getCurrentTableInsights().templates}
                    isLoading={aiInsightsLoading}
                    onTemplateClick={handleTemplateClick}
                    tableName={activeTab}
                    hasData={tables.length > 0}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Table Content */}
      <div className="flex-1 overflow-auto">
        <div className="border border-gray-600/30">
          {renderDynamicTable()}
        </div>
      </div>

      {/* Footer with pagination/info */}
      <div className="p-4 border-t border-gray-700/50 bg-[#1a1a1a]">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {getCurrentTableData().length} of {getCurrentTable()?.row_count || 0} results
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-400">
              {selectedRows.size} selected
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTablesTab;
