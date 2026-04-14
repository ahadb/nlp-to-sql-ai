import React, { useState } from 'react';
import { type ChatResponse } from '../../services/api';
import { ChevronDownIcon, ChevronUpIcon, ClipboardIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import MarkdownRenderer from './MarkdownRenderer';
import ResponseCharts from './ResponseCharts';

interface ChatMessageProps {
  message: string;
  response: ChatResponse;
  isUser: boolean;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, response, isUser, timestamp }) => {
  const [expandedSections, setExpandedSections] = useState({
    sql: false,
    data: true  // Show data results by default
  });

  const getResponseType = (message: string): string => {
    const messageLower = message.toLowerCase();
    if (messageLower.includes('top') && messageLower.includes('customer')) return 'top-customers';
    if (messageLower.includes('revenue') && messageLower.includes('trend')) return 'revenue-trends';
    if (messageLower.includes('satisfaction') || messageLower.includes('support')) return 'customer-satisfaction';
    if (messageLower.includes('billing') || messageLower.includes('payment') || messageLower.includes('overdue')) return 'sales-performance';
    if (messageLower.includes('segmentation') || messageLower.includes('tier')) return 'inventory-analysis';
    return '';
  };

  const toggleSection = (section: 'sql' | 'data') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-xs lg:max-w-md">
          <p className="text-sm">{message}</p>
          <p className="text-xs text-blue-200 mt-1">{formatTimestamp(timestamp)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-[#282828] border border-gray-600/30 rounded-lg p-4 max-w-4xl w-full">
        {/* AI Response Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AI</span>
            </div>
            <div>
              <h3 className="text-white font-medium">AI Analysis</h3>
              <p className="text-xs text-gray-400">{formatTimestamp(timestamp)}</p>
            </div>
          </div>
        </div>

        {/* Main AI Response with Markdown */}
        <div className="mb-4">
          <MarkdownRenderer content={response.message} />
        </div>

        {/* Charts Section */}
        {!isUser && response.query_results && (
          <ResponseCharts 
            responseType={response.response_type || getResponseType(message)} 
            queryResults={response.query_results} 
          />
        )}

        {/* SQL Query Section */}
        {response.sql_query && (
          <div className="mb-4">
            <button
              onClick={() => toggleSection('sql')}
              className="flex items-center justify-between w-full p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-blue-400 font-medium">SQL Query</span>
                <span className="text-xs text-gray-400">Click to {expandedSections.sql ? 'hide' : 'show'}</span>
              </div>
              {expandedSections.sql ? (
                <ChevronUpIcon className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              )}
            </button>
            
            {expandedSections.sql && (
              <div className="mt-2 p-4 bg-gray-900/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Generated SQL</span>
                  <button
                    onClick={() => copyToClipboard(response.sql_query!)}
                    className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300"
                  >
                    <ClipboardIcon className="h-3 w-3" />
                    <span>Copy</span>
                  </button>
                </div>
                <pre className="text-sm text-green-400 overflow-x-auto">
                  <code>{response.sql_query}</code>
                </pre>
              </div>
            )}
          </div>
        )}

        {/* Data Results Section */}
        {response.query_results && !response.query_results.error && (
          <div className="mb-4">
            <button
              onClick={() => toggleSection('data')}
              className="flex items-center justify-between w-full p-3 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <span className="text-green-400 font-medium">Query Results</span>
                <span className="text-xs text-gray-400">
                  {response.query_results.row_count} rows • Click to {expandedSections.data ? 'hide' : 'show'}
                </span>
              </div>
              {expandedSections.data ? (
                <ChevronUpIcon className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDownIcon className="h-4 w-4 text-gray-400" />
              )}
            </button>
            
            {expandedSections.data && (
              <div className="mt-2">
                <div className="bg-gray-900/50 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-800/50">
                        <tr>
                          {response.query_results.columns.map((column, index) => (
                            <th key={index} className="px-3 py-2 text-left text-xs font-medium text-gray-400 uppercase">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-700/50">
                        {response.query_results.data.slice(0, 10).map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-gray-800/30">
                            {response.query_results!.columns.map((column, colIndex) => (
                              <td key={colIndex} className="px-3 py-2 text-sm text-gray-300">
                                {typeof row[column] === 'number' 
                                  ? row[column].toLocaleString() 
                                  : row[column]?.toString() || '-'
                                }
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {response.query_results.row_count > 10 && (
                    <div className="px-3 py-2 text-xs text-gray-400 bg-gray-800/30">
                      Showing 10 of {response.query_results.row_count} rows
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    Total: {response.query_results.row_count} rows
                  </span>
                  <button className="flex items-center space-x-1 text-xs text-blue-400 hover:text-blue-300">
                    <ArrowDownTrayIcon className="h-3 w-3" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {response.query_results?.error && (
          <div className="p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm font-medium">Query Error</p>
            <p className="text-red-300 text-xs mt-1">{response.query_results.error}</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ChatMessage;
