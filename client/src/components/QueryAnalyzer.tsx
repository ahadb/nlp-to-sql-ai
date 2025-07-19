import { useState } from "react";
import { MagnifyingGlassIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";
import StepTitle from "./StepTitle";

interface QueryAnalyzerProps {
  onAnalyze?: (query: string, sqlData?: GeneratedSQL) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

interface GeneratedSQL {
  question: string;
  sql_query: string;
  schema: string;
}

export default function QueryAnalyzer({
  onAnalyze,
  isSelected = false,
  onSelect,
}: QueryAnalyzerProps) {
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await api.generateSQL(query);
      onAnalyze?.(query, response.data);
    } catch (error) {
      console.error("Error generating SQL:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate SQL"
      );
      onAnalyze?.(query);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-900/20 shadow-lg"
          : "border-gray-700 hover:border-gray-600 hover:bg-gray-800"
      }`}
      onClick={onSelect}
    >
      <div className="mb-4 pb-2 border-b border-gray-700 -mx-4 px-4 bg-gray-800 -mt-4 pt-3 rounded-t-xl">
        <StepTitle
          title="Generate Query"
          description="Type your question in plain English and get the corresponding SQL query"
          icon={MagnifyingGlassIcon}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="schema-query"
            className="block text-sm font-medium text-gray-300"
          >
            What would you like to query?
          </label>
          <textarea
            id="schema-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Show me all customers from the USA who have placed more than 5 orders since 2023, sorted by total spending..."
            className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 hover:border-gray-500 bg-gray-700 text-gray-200 placeholder-gray-400"
            rows={2}
            disabled={isAnalyzing}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Northwind Query Templates */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="font-medium">Quick Templates:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
              {[
                {
                  title: "Top Customers",
                  query:
                    "Show me the top 10 customers by total order value, including their company name and total spent",
                  category: "Sales",
                },
                {
                  title: "Product Performance",
                  query:
                    "Which products have the highest sales volume? Show product name, category, and total units sold",
                  category: "Products",
                },
                {
                  title: "Regional Sales",
                  query:
                    "Break down sales by region and country, showing total revenue and number of orders",
                  category: "Analytics",
                },
                {
                  title: "Employee Performance",
                  query:
                    "Show employee performance with their total sales, number of orders, and average order value",
                  category: "HR",
                },
                {
                  title: "Supplier Analysis",
                  query:
                    "List suppliers with their product count, average product price, and total inventory value",
                  category: "Supply Chain",
                },
                {
                  title: "Order Trends",
                  query:
                    "Show monthly order trends for the last 2 years with total revenue and order count",
                  category: "Trends",
                },
              ].map((template, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setQuery(template.query);
                  }}
                  className="text-left p-1.5 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 hover:from-blue-900/30 hover:to-indigo-900/30 border border-blue-700 hover:border-blue-600 rounded-lg transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between mb-0.5">
                    <span className="text-xs font-semibold text-blue-300 group-hover:text-blue-200">
                      {template.title}
                    </span>
                    <span className="text-xs px-1 py-0.5 bg-blue-600 text-white rounded-full font-medium">
                      {template.category}
                    </span>
                  </div>
                  <p className="text-xs text-blue-400 leading-tight">
                    {template.query.length > 45
                      ? template.query.substring(0, 45) + "..."
                      : template.query}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!query.trim() || isAnalyzing}
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {isAnalyzing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Generate Query
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-sm text-red-300 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
