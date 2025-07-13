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
      className={`w-full p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-lg"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
      onClick={onSelect}
    >
      <div className="mb-6 pb-3 border-b border-gray-200 -mx-6 px-6 bg-gray-50 -mt-6 pt-4 rounded-t-xl">
        <StepTitle
          title="Generate Query"
          description="Type your question in plain English and get the corresponding SQL query"
          icon={MagnifyingGlassIcon}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="schema-query"
            className="block text-sm font-medium text-gray-700"
          >
            What would you like to query?
          </label>
          <textarea
            id="schema-query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., Show me all customers from the USA who have placed more than 5 orders since 2023, sorted by total spending..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 hover:border-gray-400 bg-white"
            rows={4}
            disabled={isAnalyzing}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Inline example chips */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="font-medium">Try:</span>
            {[
              "California customers",
              "Orders >$1000",
              "Sales by region",
              "Top 10 customers",
            ].map((example, index) => (
              <button
                key={index}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setQuery(example);
                }}
                className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-200 border border-blue-200 hover:border-blue-300 font-medium"
              >
                {example}
              </button>
            ))}
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
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
