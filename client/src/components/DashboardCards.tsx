// client/src/components/Dashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import { api, type InsightData, type InsightsResponse } from '../services/api';

// client/src/data/mockInsights.ts
// export interface InsightData {
//   title: string;
//   metric: string;
//   change: string;
//   description: string;
//   trend: 'up' | 'down' | 'stable';
//   data_points: number[];
// }

// export interface InsightsResponse {
//   status: string;
//   insights: InsightData[];
//   patterns: InsightData[];
// }

// export const mockInsightsResponse: InsightsResponse = {
//   "status": "success",
//   "insights": [
//     {
//       "title": "Overdue Invoices",
//       "metric": "2",
//       "change": "-50%",
//       "description": "Reduction in overdue invoices this month",
//       "trend": "down",
//       "data_points": [4, 3, 3, 2, 2]
//     },
//     {
//       "title": "Support Satisfaction",
//       "metric": "4.5",
//       "change": "+10%",
//       "description": "Average customer satisfaction rating for support tickets",
//       "trend": "up",
//       "data_points": [4, 4, 4, 4, 5]
//     }
//   ],
//   "patterns": [
//     {
//       "title": "Overdue Invoices",
//       "metric": "5",
//       "change": "+25%",
//       "description": "Increase in overdue invoices this month.",
//       "trend": "up",
//       "data_points": [3, 4, 5, 4, 5]
//     },
//     {
//       "title": "Customer Satisfaction",
//       "metric": "4.5/5",
//       "change": "↗️",
//       "description": "Average satisfaction rating from support tickets.",
//       "trend": "up",
//       "data_points": [4, 4, 5, 4, 5]
//     }
//   ]
// };

interface DashboardCardsProps {
  hasData?: boolean;
}

const Dashboard: React.FC<DashboardCardsProps> = ({ hasData = true }) => {
  const [insights, setInsights] = useState<InsightData[]>([]);
  const [patterns, setPatterns] = useState<InsightData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    console.log('🔍 DashboardCards useEffect triggered, hasFetched:', hasFetched.current, 'hasData:', hasData);
    if (hasData && !hasFetched.current) {
      hasFetched.current = true;
      console.log('🚀 Calling fetchInsights for the first time');
      fetchInsights();
    } else if (!hasData) {
      console.log('📊 No data loaded - showing empty state');
      setLoading(false);
      setInsights([]);
      setPatterns([]);
    } else {
      console.log('⏭️ Skipping fetchInsights - already called');
    }
  }, [hasData]);

  const fetchInsights = async () => {
    try {
      console.log('📡 fetchInsights called - making API request');
      setLoading(true);
      setError(null);
      
      // Add delay to simulate AI processing time
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const data: InsightsResponse = await api.getDashboardInsights();
      console.log('✅ API response received:', data);
      // const data: InsightsResponse = mockInsightsResponse;
      
      if (data.status === 'success') {
        setInsights(data.insights || []);
        setPatterns(data.patterns || []);
      } else {
        setError(data.message || 'Failed to fetch insights');
      }
    } catch (err) {
      setError('Failed to fetch insights');
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  // Empty state when no data is loaded
  if (!hasData && !loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Empty state cards */}
          {[
            { title: "Revenue Trends", metric: "0", description: "No data available" },
            { title: "Customer Insights", metric: "0", description: "No data available" },
            { title: "Data Quality", metric: "0", description: "No data available" },
            { title: "Performance", metric: "0", description: "No data available" }
          ].map((card, index) => (
            <div key={index} className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-4 opacity-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded">No Data</span>
              </div>
              
              <div className="flex items-end space-x-3 mb-4">
                <div>
                  <p className="text-white text-3xl font-bold">{card.metric}</p>
                  <p className="text-sm text-slate-500 line-clamp-2">{card.description}</p>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-gray-500 text-sm">--</span>
                </div>
              </div>
              
              {/* Empty sparkline area */}
              <div className="relative h-8 w-full mb-1">
                <div className="h-full bg-gray-800/30 rounded flex items-center justify-center">
                  <span className="text-gray-600 text-xs">No chart data</span>
                </div>
              </div>
              
              <p className="text-slate-500 text-xs">Load data to see insights</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {/* Multi-step loading for each card */}
          {[
            { title: "Analyzing Revenue Trends", step: "Processing sales data..." },
            { title: "Customer Behavior Insights", step: "Identifying patterns..." },
            { title: "Data Quality Patterns", step: "Validating metrics..." },
            { title: "Performance Anomalies", step: "Detecting outliers..." }
          ].map((card, index) => (
            <div key={index} className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-4 relative overflow-hidden">
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent animate-pulse"></div>
              
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-700/50 rounded w-2/3 animate-pulse"></div>
                  <div className="h-5 bg-gray-700/50 rounded w-16 animate-pulse"></div>
                </div>
                
                {/* Metric and description */}
                <div className="flex items-end space-x-3 mb-4">
                  <div>
                    <div className="h-8 bg-gray-700/50 rounded w-20 mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-700/50 rounded w-12 animate-pulse"></div>
                </div>
                
                {/* Sparkline placeholder */}
                <div className="relative h-8 w-full mb-1">
                  <div className="h-full bg-gray-700/30 rounded animate-pulse">
                    <div className="h-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded animate-pulse"></div>
                  </div>
                </div>
                
                {/* Step indicator */}
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    {[1, 2, 3].map((step) => (
                      <div 
                        key={step}
                        className={`w-2 h-2 rounded-full ${
                          step <= (index + 1) ? 'bg-blue-400 animate-pulse' : 'bg-gray-600'
                        }`}
                      ></div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 animate-pulse">
                    {card.step}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Overall progress indicator */}
        <div className="flex justify-center">
          <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-lg px-6 py-3">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400 border-t-transparent"></div>
              <span className="text-sm text-gray-300">Generating AI insights and patterns...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
        <h3 className="text-red-400 font-semibold mb-2">Error Loading Insights</h3>
        <p className="text-red-300">{error}</p>
        <button 
          onClick={fetchInsights}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // client/src/components/DashboardCards.tsx
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-4 gap-6">
        {/* Business Insights - First 2 cards */}
        {insights.map((insight, index) => (
          <div key={index} className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-4 hover:border-gray-500/50 transition-all duration-300 relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm font-medium">{insight.title}</p>
              <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-400/30 px-2 py-1 rounded">AI Generated</span>
            </div>
            
            <div className="flex items-end space-x-3 mb-4">
              <div>
                <p className="text-white text-3xl font-bold">{insight.metric}</p>
                <p className="text-sm text-slate-500 line-clamp-2">{insight.description}</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-emerald-400 text-sm">{insight.change}</span>
              </div>
            </div>
            
            {/* Sparkline Chart */}
            {insight.data_points && insight.data_points.length > 0 && (
              <div className="relative h-8 w-full mb-1">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke={insight.trend === 'up' ? 'rgb(34 197 94)' : insight.trend === 'down' ? 'rgb(239 68 68)' : 'rgb(156 163 175)'}
                    strokeWidth="2"
                    points={insight.data_points.map((point, i) => 
                      `${i * (100 / (insight.data_points.length - 1))},${30 - (point / Math.max(...insight.data_points)) * 30}`
                    ).join(' ')}
                  />
                </svg>
              </div>
            )}
            
            <p className="text-slate-500 text-xs">AI Insight Analysis</p>
          </div>
        ))}
  
        {/* Data Patterns - Last 2 cards */}
        {patterns.map((pattern, index) => (
          <div key={index} className="bg-[#1a1a1a] border border-gray-600/30 rounded-xl p-4 hover:border-gray-500/50 transition-all duration-300 relative">
            <div className="flex items-center justify-between mb-2">
              <p className="text-slate-400 text-sm font-medium">{pattern.title}</p>
              <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-400/30 px-2 py-1 rounded">AI Generated</span>
            </div>
            
            <div className="flex items-end space-x-3 mb-4">
              <div>
                <p className="text-white text-3xl font-bold">{pattern.metric}</p>
                <p className="text-sm text-slate-500 line-clamp-2">{pattern.description}</p>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-blue-400 text-sm">{pattern.change}</span>
              </div>
            </div>
            
            {/* Sparkline Chart */}
            {pattern.data_points && pattern.data_points.length > 0 && (
              <div className="relative h-8 w-full mb-1">
                <svg className="w-full h-full" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke={pattern.trend === 'up' ? 'rgb(59 130 246)' : pattern.trend === 'down' ? 'rgb(249 115 22)' : 'rgb(156 163 175)'}
                    strokeWidth="2"
                    points={pattern.data_points.map((point, i) => 
                      `${i * (100 / (pattern.data_points.length - 1))},${30 - (point / Math.max(...pattern.data_points)) * 30}`
                    ).join(' ')}
                  />
                </svg>
              </div>
            )}
            
            <p className="text-slate-500 text-xs">AI Pattern Analysis</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;