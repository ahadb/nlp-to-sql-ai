import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { api } from "../services/api";
import StepTitle from "./StepTitle";
import { useQueryHistory } from "../contexts/QueryHistoryContext";
import { useApp } from "../contexts/AppContext";

interface QueryAnalyzerProps {
  onAnalyze?: (query: string, sqlData?: GeneratedSQL) => void;
  isSelected?: boolean;
  onSelect?: () => void;
  refreshTrigger?: number; // Add this to trigger refresh
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
  refreshTrigger,
}: QueryAnalyzerProps) {
  const [query, setQuery] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<"sql" | "csv">(
    "sql"
  );
  const [currentDatabase, setCurrentDatabase] = useState<string | null>(null);
  const [schemaDetails, setSchemaDetails] = useState<any>(null);
  const [isLoadingDatabase, setIsLoadingDatabase] = useState(true); // Start as true to show loading initially
  const { addQuery } = useQueryHistory();
  const {
    selectedQuery,
    setSelectedQuery,
    currentSchema,
    currentTable,
    setCurrentGeneratedSQL,
  } = useApp();

  // Populate query input when a query is selected from history
  useEffect(() => {
    if (selectedQuery) {
      setQuery(selectedQuery.question);
      setSelectedQuery(null); // Clear the selection after populating
    }
  }, [selectedQuery, setSelectedQuery]);

  // Fetch current database context and schema
  useEffect(() => {
    const fetchCurrentDatabase = async () => {
      setIsLoadingDatabase(true);

      // Add a small delay to ensure backend has processed any recent uploads
      if (refreshTrigger && refreshTrigger > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      try {
        const response = await api.getCurrentDatabase();
        console.log("Current database response:", response);

        // Check if we have a real database (not just default databases)
        console.log(
          "Database check:",
          response.database,
          "File type:",
          response.file_type
        );

        // Simple check - if we have a database, use it
        if (response.database) {
          setCurrentDatabase(response.database);
          setSelectedDatabase((response.file_type as "sql" | "csv") || "sql");
          console.log(
            "Setting database:",
            response.database,
            "Type:",
            response.file_type
          );

          // Get schema details for templates
          try {
            const schemaResponse = await api.getSchemaDetails();
            setSchemaDetails(schemaResponse.schema_details);
          } catch (schemaError) {
            console.log("No schema details available:", schemaError);
            setSchemaDetails(null);
          }
        } else {
          setCurrentDatabase(null);
          setSelectedDatabase("sql");
          setSchemaDetails(null);
          console.log("No database found");
        }
      } catch (error: any) {
        console.log("No database context available yet:", error);
        // This is expected on initial load - no database uploaded yet
        setCurrentDatabase(null);
        setSelectedDatabase("sql");
        setSchemaDetails(null);
        console.log("Setting initial state: NO DATABASE ADDED");
      } finally {
        setIsLoadingDatabase(false);
      }
    };

    fetchCurrentDatabase();
  }, [refreshTrigger]);

  // Generate dynamic templates based on schema
  const generateDynamicTemplates = () => {
    if (!schemaDetails) return [];

    const templates: Array<{
      title: string;
      query: string;
      category: string;
      table: string;
    }> = [];
    const tables = Object.keys(schemaDetails);

    tables.forEach((tableName) => {
      const columns = schemaDetails[tableName];
      const columnNames = columns.map((col: { column: string }) => col.column);

      // Basic exploration template
      templates.push({
        title: `Explore ${tableName}`,
        query: `Show me the first 10 rows from ${tableName}`,
        category: "Data Exploration",
        table: tableName,
      });

      // Count template
      templates.push({
        title: `Count ${tableName}`,
        query: `How many records are in ${tableName}?`,
        category: "Aggregation",
        table: tableName,
      });

      // Look for common patterns
      if (
        columnNames.some(
          (col: string) => col.includes("date") || col.includes("time")
        )
      ) {
        templates.push({
          title: `Recent ${tableName}`,
          query: `Show me the most recent records from ${tableName}`,
          category: "Time-based",
          table: tableName,
        });
      }

      if (
        columnNames.some(
          (col: string) =>
            col.includes("amount") ||
            col.includes("price") ||
            col.includes("cost")
        )
      ) {
        templates.push({
          title: `Total ${tableName}`,
          query: `What's the total amount in ${tableName}?`,
          category: "Financial",
          table: tableName,
        });
      }

      if (
        columnNames.some(
          (col: string) => col.includes("name") || col.includes("title")
        )
      ) {
        templates.push({
          title: `All ${tableName} Names`,
          query: `Show me all the names/titles from ${tableName}`,
          category: "Listing",
          table: tableName,
        });
      }
    });

    return templates.slice(0, 6); // Limit to 6 templates
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await api.generateSQL(
        query,
        currentSchema || undefined,
        currentTable || undefined
      );
      const sqlData = response.data;

      // Store the generated SQL in AppContext
      setCurrentGeneratedSQL(sqlData.sql_query);
      console.log("Generated SQL stored in context:", sqlData.sql_query);

      // Add successful query to history
      addQuery(query, sqlData.sql_query, "success");

      onAnalyze?.(query, sqlData);
    } catch (error) {
      console.error("Error generating SQL:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate SQL";
      setError(errorMessage);

      // Add failed query to history
      addQuery(query, "", "error");

      onAnalyze?.(query);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div
      className={`w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-blue-900 bg-blue-900/20 shadow-lg"
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

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="space-y-1.5">
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
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.();
            }}
          />

          {/* Database Context Indicator */}
          {!isLoadingDatabase && currentDatabase ? (
            <div className="p-2 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                  <div>
                    <div className="text-xs font-medium text-gray-200">
                      <span className="text-blue-300 mr-1">Database:</span>
                      {currentDatabase}
                      {selectedDatabase && (
                        <span className="text-blue-300 ml-1">
                          ({selectedDatabase.toUpperCase()})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-[10px] text-blue-300 bg-blue-900/30 px-1.5 py-0.5 rounded-full">
                  READY
                </div>
              </div>
            </div>
          ) : !isLoadingDatabase ? (
            <div className="p-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                  <div>
                    <span className="text-xs font-medium text-gray-300">
                      NO DATABASE ADDED
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-gray-400 bg-gray-800/30 px-1.5 py-0.5 rounded-full">
                  UPLOAD
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2 bg-gradient-to-r from-gray-600/20 to-gray-700/20 border border-gray-500/50 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
                  <div>
                    <span className="text-xs font-medium text-gray-300">
                      LOADING...
                    </span>
                  </div>
                </div>
                <div className="text-[10px] text-gray-400 bg-gray-800/30 px-1.5 py-0.5 rounded-full">
                  CHECKING
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Query Templates */}
          {schemaDetails && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="font-medium">Smart Templates:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {generateDynamicTemplates().map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuery(template.query);
                    }}
                    className="text-left p-2 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 hover:from-blue-900/30 hover:to-indigo-900/30 border border-gray-600 hover:border-gray-500 rounded-md transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-0.5">
                      <span className="text-xs font-semibold text-gray-300 group-hover:text-gray-200">
                        {template.title}
                      </span>
                      <span className="text-[10px] px-2 py-1 bg-blue-600 text-white rounded-full font-medium">
                        {template.category}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-tight">
                      {template.query.length > 45
                        ? template.query.substring(0, 45) + "..."
                        : template.query}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
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
