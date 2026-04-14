import React, { useState } from 'react';
import {
  ChartBarIcon,
  ArrowDownTrayIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  TableCellsIcon,
  ChartPieIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon
} from '@heroicons/react/24/outline';

interface QueryResult {
  id: string;
  question: string;
  results: any[];
  insights: string[];
  recommendations: string[];
  timestamp: string;
}

interface ResultsDashboardProps {
  isFullWidth?: boolean;
  setIsFullWidth?: (fullWidth: boolean) => void;
  queryResult?: QueryResult | null;
}

const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ 
  isFullWidth = false,
  setIsFullWidth,
  queryResult
}) => {
  const [viewMode, setViewMode] = useState<'table' | 'insights'>('table');
  const [activeDataTab, setActiveDataTab] = useState<'sales' | 'customers' | 'expenses' | 'all'>('sales');
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // Sample data for demonstration
  const currentResult = queryResult || {
    id: '1',
    question: 'Show me top customers by revenue',
    results: [
      { id: 1, customer: 'Acme Corp', revenue: '$45,230', orders: 23, status: 'Active' },
      { id: 2, customer: 'TechStart Inc', revenue: '$32,150', orders: 18, status: 'Active' },
      { id: 3, customer: 'Global Solutions', revenue: '$28,940', orders: 15, status: 'Pending' },
      { id: 4, customer: 'Innovation Labs', revenue: '$21,780', orders: 12, status: 'Active' },
      { id: 5, customer: 'Future Systems', revenue: '$19,650', orders: 9, status: 'Active' },
    ],
    insights: [
      'Revenue increased 23% compared to last quarter',
      'Top 3 customers account for 65% of total revenue',
      'Average order value is $1,847 per customer'
    ],
    recommendations: [
      'Focus on retaining top 3 customers with personalized offers',
      'Investigate why Global Solutions orders are pending',
      'Implement loyalty program for customers with 10+ orders'
    ],
    timestamp: 'Just now'
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      const allIds = new Set(currentResult.results.map((_, index) => index));
      setSelectedRows(allIds);
    }
    setSelectAll(!selectAll);
  };

  const handleRowSelect = (index: number) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(index)) {
      newSelectedRows.delete(index);
    } else {
      newSelectedRows.add(index);
    }
    setSelectedRows(newSelectedRows);
    setSelectAll(newSelectedRows.size === currentResult.results.length);
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Show empty state if no query result */}
      {!queryResult && (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <ChartBarIcon className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">No Results Yet</h3>
            <p className="text-gray-400">
              Upload data and ask a question to see business insights here
            </p>
          </div>
        </div>
      )}
      
      {/* Results Content */}
      {queryResult && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header with Controls */}
          <div className="p-4 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white">Query Results</h3>
                <p className="text-sm text-gray-400">"{currentResult.question}"</p>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-[#262626] rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-1.5 rounded-md transition-all duration-200 ${
                      viewMode === 'table' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <TableCellsIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('insights')}
                    className={`p-1.5 rounded-md transition-all duration-200 ${
                      viewMode === 'insights' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <ChartPieIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Full Width Toggle */}
                {setIsFullWidth && (
                  <button
                    onClick={() => setIsFullWidth(!isFullWidth)}
                    className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all duration-200"
                    title={isFullWidth ? "Return to Drawer" : "Expand Full Width"}
                  >
                    {isFullWidth ? (
                      <ArrowsPointingInIcon className="h-4 w-4" />
                    ) : (
                      <ArrowsPointingOutIcon className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{currentResult.timestamp}</span>
              <div className="flex items-center space-x-2">
                {/* Action Buttons */}
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-lg transition-colors duration-200">
                  <ArrowDownTrayIcon className="h-3 w-3" />
                  <span>Export Excel</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded-lg transition-colors duration-200">
                  <EnvelopeIcon className="h-3 w-3" />
                  <span>Email Report</span>
                </button>
              </div>
            </div>
          </div>

          {/* Data Source Tabs - Only show for table view */}
          {viewMode === 'table' && (
            <div className="flex items-center space-x-1 px-4 py-3 border-b border-gray-700/50 bg-gray-900/20">
              {(['sales', 'customers', 'expenses', 'all'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveDataTab(tab)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeDataTab === tab
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 overflow-auto">
            {viewMode === 'table' ? (
              // Table View
              <div className="border border-gray-600/30">
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Revenue</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Orders</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700/30">
                    {currentResult.results.map((row, index) => (
                      <tr key={row.id} className="hover:bg-gray-800/30 transition-colors duration-200">
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
                        <td className="px-4 py-3 text-sm text-white font-medium">{row.customer}</td>
                        <td className="px-4 py-3 text-sm text-white">{row.revenue}</td>
                        <td className="px-4 py-3 text-sm text-white">{row.orders}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                            row.status === 'Active' 
                              ? 'bg-green-500/20 text-green-300' 
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Insights View */
              <div className="p-6 space-y-6">
                {/* Key Insights */}
                {currentResult.insights.length > 0 && (
                  <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <ExclamationTriangleIcon className="h-6 w-6 text-amber-400" />
                      <h4 className="text-lg font-semibold text-white">Key Insights</h4>
                    </div>
                    <div className="space-y-3">
                      {currentResult.insights.map((insight, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                          <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300">{insight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {currentResult.recommendations.length > 0 && (
                  <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <LightBulbIcon className="h-6 w-6 text-blue-400" />
                      <h4 className="text-lg font-semibold text-white">Recommendations</h4>
                    </div>
                    <div className="space-y-3">
                      {currentResult.recommendations.map((rec, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                          <p className="text-gray-300">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary Stats */}
                <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-4">Summary Statistics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-400">{currentResult.results.length}</div>
                      <div className="text-sm text-gray-400">Total Records</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-400">$127K</div>
                      <div className="text-sm text-gray-400">Total Revenue</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-400">77</div>
                      <div className="text-sm text-gray-400">Total Orders</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-2xl font-bold text-amber-400">$1.8K</div>
                      <div className="text-sm text-gray-400">Avg Order Value</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsDashboard;