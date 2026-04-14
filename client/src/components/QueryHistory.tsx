import React, { useState } from "react";
import { type QueryHistoryItem } from "../types/query";
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

interface QueryHistoryProps {
  queries: QueryHistoryItem[];
  onQuerySelect?: (query: QueryHistoryItem) => void;
  onReRunQuery?: (sql: string) => void;
}

const QueryHistory: React.FC<QueryHistoryProps> = ({
  queries,
  onQuerySelect,
  onReRunQuery,
}) => {
  const [expandedQueries, setExpandedQueries] = useState<Set<string>>(
    new Set()
  );

  const toggleQuery = (queryId: string) => {
    setExpandedQueries((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(queryId)) {
        newSet.delete(queryId);
      } else {
        newSet.add(queryId);
      }
      return newSet;
    });
  };

  const formatTimeAgo = (timestamp: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - timestamp.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircleIcon className="w-4 h-4 text-green-500" />;
      case "error":
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-white mb-3 ml-2">Recent Queries</h3>

      {queries.length === 0 ? (
        <p className="text-sm text-gray-500 italic">No recent queries</p>
      ) : (
        <div className="space-y-2">
          {queries.slice(0, 4).map((query) => {
            const isExpanded = expandedQueries.has(query.id);

            return (
              <div
                key={query.id}
                className={`rounded-lg border border-gray-600/50 transition-all duration-200 hover:bg-cyan-500/10 hover:border-cyan-500/50 ${
                  onQuerySelect ? "cursor-pointer" : ""
                }`}
              >
                {/* Header - Always visible */}
                <div
                  className="p-3 cursor-pointer"
                  onClick={() => toggleQuery(query.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(query.status)}
                      <span
                        className={`text-xs font-medium ${getStatusColor(
                          query.status
                        )}`}
                      >
                        {query.status}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatTimeAgo(query.timestamp)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      {isExpanded ? (
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-200 font-medium truncate">
                    {query.question}
                  </p>
                </div>

                {/* Collapsible content */}
                {isExpanded && (
                  <div className="px-3 pb-3 border-t border-cyan-500/20">
                    <div className="mt-3 text-xs text-gray-300 font-mono bg-gray-800/50 border border-gray-700/50 p-2 rounded-lg">
                      {query.sql}
                    </div>

                    {query.results && query.status === "success" && (
                      <div className="mt-2 text-xs text-gray-400">
                        {Array.isArray(query.results)
                          ? `${query.results.length} results`
                          : "1 result"}
                      </div>
                    )}

                    <div className="flex space-x-2 mt-2">
                      {onQuerySelect && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onQuerySelect(query);
                          }}
                          className="text-xs text-blue-400 hover:text-blue-300 font-medium"
                        >
                          Use this query
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onReRunQuery?.(query.sql);
                        }}
                        className="text-xs text-green-400 hover:text-green-300 font-medium"
                      >
                        Re-run query
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueryHistory;
