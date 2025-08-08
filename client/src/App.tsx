import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import {
  DocumentTextIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  PlayIcon,
  ArrowDownTrayIcon,
  ArrowRightIcon,
  CircleStackIcon,
  ChartBarIcon,
  CodeBracketIcon,
} from "@heroicons/react/24/outline";

import {
  Sidebar,
  MobileSidebar,
  TopBar,
  Layout,
  FileUpload,
  QueryAnalyzer,
} from "./components";
import HighlightedCode from "./components/CodeHighlighter";
import { api } from "./services/api";
import {
  QueryHistoryProvider,
  useQueryHistory,
} from "./contexts/QueryHistoryContext";
import { AppProvider, useApp } from "./contexts/AppContext";

interface GeneratedSQL {
  question: string;
  sql_query: string;
  schema: string;
}

// Landing Page Component
function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/app");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-2xl">
                  <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold text-blue-600">SQL</span>
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              SQL AI Assistant
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform your natural language questions into powerful SQL
              queries. No coding required - just ask what you want to know about
              your data.
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              Get Started
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CodeBracketIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Natural Language to SQL
            </h3>
            <p className="text-gray-400">
              Ask questions in plain English and get accurate SQL queries
              instantly
            </p>
          </div>
          <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <CircleStackIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Multiple Database Support
            </h3>
            <p className="text-gray-400">
              Works with Northwind, Netflix, Chinook, and custom database
              schemas
            </p>
          </div>
          <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChartBarIcon className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Instant Results
            </h3>
            <p className="text-gray-400">
              Execute queries and visualize results with export capabilities
            </p>
          </div>
        </div>

        {/* Available Databases */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Available Databases
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Northwind",
                description:
                  "Classic business database with customers, orders, products, and suppliers",
                icon: "🏢",
                features: [
                  "Sales Analytics",
                  "Customer Insights",
                  "Inventory Management",
                ],
              },
              {
                name: "Netflix",
                description:
                  "Streaming platform data with movies, shows, and user preferences",
                icon: "🎬",
                features: [
                  "Content Analysis",
                  "Viewing Patterns",
                  "Genre Trends",
                ],
              },
              {
                name: "Chinook",
                description:
                  "Music store database with artists, albums, tracks, and sales",
                icon: "🎵",
                features: [
                  "Music Analytics",
                  "Artist Performance",
                  "Sales Tracking",
                ],
              },
              {
                name: "Custom Schema",
                description:
                  "Upload your own database schema for personalized queries",
                icon: "⚙️",
                features: [
                  "Schema Upload",
                  "Custom Tables",
                  "Flexible Queries",
                ],
              },
            ].map((db, index) => (
              <div
                key={index}
                className="bg-gray-800/50 rounded-xl border border-gray-700 p-6 hover:border-blue-500 transition-all duration-200"
              >
                <div className="text-4xl mb-4">{db.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {db.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4">{db.description}</p>
                <div className="space-y-1">
                  {db.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-xs text-gray-300"
                    >
                      <CheckIcon className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Upload Schema
              </h3>
              <p className="text-gray-400">
                Choose from pre-built databases or upload your own schema file
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Ask Questions
              </h3>
              <p className="text-gray-400">
                Type your question in natural language or use quick templates
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Get Results
              </h3>
              <p className="text-gray-400">
                Review the generated SQL, run it, and export your results
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-8 border border-blue-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to Transform Your Data Queries?
            </h2>
            <p className="text-gray-300 mb-6">
              Start asking questions about your data in plain English today
            </p>
            <button
              onClick={handleGetStarted}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              Start Querying Now
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState<GeneratedSQL | null>(null);
  // const [hasUploadedSchema, setHasUploadedSchema] = useState(false);
  // const [currentStep, setCurrentStep] = useState(1);
  const [selectedSection, setSelectedSection] = useState<
    "query" | "upload" | null
  >("upload");
  const [isCopied, setIsCopied] = useState(false);
  const [isRunningQuery, setIsRunningQuery] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [isExplainOpen, setIsExplainOpen] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [lastNLQuery, setLastNLQuery] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { addQuery, clearHistory } = useQueryHistory();

  // Manual clear history function
  const handleClearHistory = () => {
    localStorage.removeItem("queryHistory");
    clearHistory();
  };

  // Handle re-running queries from history
  const handleReRunQuery = useCallback(
    async (sql: string) => {
      setIsRunningQuery(true);
      try {
        console.log("Re-running query:", sql);
        const response = await api.runSQL(sql);
        console.log("API Response:", response);
        const results = response.data || [];
        setQueryResults(results);
        setIsModalOpen(true);

        // Add successful query execution to history
        addQuery("Re-run query", sql, "success", results);
      } catch (error) {
        console.error("Error re-running query:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        alert(`Error re-running query: ${errorMessage}`);

        // Add failed query execution to history
        addQuery("Re-run query", sql, "error");
      } finally {
        setIsRunningQuery(false);
      }
    },
    [addQuery]
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleFileUpload = (file: File) => {
    console.log("File uploaded successfully:", file.name);
    // Trigger refresh of database context
    setRefreshTrigger((prev) => prev + 1);
    // setHasUploadedSchema(true);
    // setCurrentStep(2);
  };

  const handleSchemaAnalysis = (query: string, sqlData?: GeneratedSQL) => {
    console.log("Schema analysis requested:", query);
    if (sqlData) {
      setGeneratedSQL(sqlData);
      setLastNLQuery(query);
    }
  };

  const handleRunQuery = async () => {
    if (!generatedSQL) return;

    setIsRunningQuery(true);
    try {
      console.log("Running query:", generatedSQL.sql_query);
      const response = await api.runSQL(generatedSQL.sql_query);
      console.log("API Response:", response);
      const results = response.data || [];
      setQueryResults(results);
      setIsModalOpen(true);

      // Add successful query execution to history
      addQuery(
        lastNLQuery || "Custom SQL query",
        generatedSQL.sql_query,
        "success",
        results
      );
    } catch (error) {
      console.error("Error running query:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Error running query: ${errorMessage}`);

      // Add failed query execution to history
      addQuery(
        lastNLQuery || "Custom SQL query",
        generatedSQL.sql_query,
        "error"
      );
    } finally {
      setIsRunningQuery(false);
    }
  };

  const exportToExcel = () => {
    if (queryResults.length === 0) return;

    const headers = Object.keys(queryResults[0]);
    const csvContent = [
      headers.join(","),
      ...queryResults.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            const escapedValue = String(value).replace(/"/g, '""');
            return `"${escapedValue}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `query_results_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <TopBar setSidebarOpen={setSidebarOpen} />
      <Layout
        leftChildren={
          <div className="space-y-8">
            {/* File Upload Section */}
            <div>
              <FileUpload
                onFileUpload={handleFileUpload}
                isSelected={selectedSection === "upload"}
                onSelect={() => setSelectedSection("upload")}
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-8 -mx-4 sm:-mx-6 lg:-mx-8"></div>

            {/* Natural Language to SQL Section */}
            <div>
              <QueryAnalyzer
                onAnalyze={handleSchemaAnalysis}
                isSelected={selectedSection === "query"}
                onSelect={() => setSelectedSection("query")}
                refreshTrigger={refreshTrigger}
              />
            </div>
          </div>
        }
        rightChildren={
          <div className="h-full flex flex-col space-y-8 bg-black">
            {/* SQL Display Card */}
            <div className="w-full p-6 border-2 border-gray-700 hover:border-gray-600 hover:bg-gray-800 transition-all duration-200 bg-gray-900 flex-1 flex flex-col">
              {/* Step Title with Border */}
              <div className="mb-6 pb-3 border-b border-gray-700 -mx-6 px-6 bg-gray-900 -mt-6 pt-4 flex-shrink-0">
                <div className="mb-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-600">
                      <DocumentTextIcon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-100 mb-0">
                        Generated SQL
                      </h3>
                      <p className="text-xs text-gray-400 leading-none mt-0.5">
                        Your generated SQL query will appear here
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SQL Content */}
              <div className="flex-1 bg-gray-900 rounded-xl border border-gray-700 overflow-hidden min-h-0">
                {generatedSQL ? (
                  <div className="h-full flex flex-col">
                    {/* SQL Query */}
                    <div className="flex-1 overflow-auto">
                      <div className="flex justify-between items-start p-4 -mb-6">
                        <h4 className="text-sm font-semibold text-gray-300">
                          Generated SQL Query
                        </h4>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleRunQuery}
                            disabled={isRunningQuery}
                            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-lg transition-colors duration-200"
                          >
                            {isRunningQuery ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                Running...
                              </>
                            ) : (
                              <>
                                <PlayIcon className="h-4 w-4 mr-2" />
                                Run Query
                              </>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              copyToClipboard(generatedSQL.sql_query)
                            }
                            className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                            title="Copy SQL to clipboard"
                          >
                            {isCopied ? (
                              <CheckIcon className="h-5 w-5 text-green-400" />
                            ) : (
                              <ClipboardDocumentIcon className="h-5 w-5" />
                            )}
                          </button>
                          {/* Explain SQL Button */}
                          <button
                            onClick={() => {
                              setExplanation(
                                lastNLQuery
                                  ? lastNLQuery
                                  : "This is a custom query. (AI explanation coming soon!)"
                              );
                              setIsExplainOpen(true);
                            }}
                            className="p-2 text-blue-400 hover:text-blue-200 rounded-lg transition-colors flex items-center"
                            title="Explain SQL"
                          >
                            <DocumentTextIcon className="h-5 w-5 mr-1" />
                            Explain SQL
                          </button>
                        </div>
                      </div>

                      <HighlightedCode
                        key={generatedSQL.sql_query}
                        language="sql"
                        code={generatedSQL.sql_query}
                      />
                    </div>

                    {/* Schema Info */}
                    <div className="border-t border-gray-700 bg-gray-800 p-4">
                      <div className="text-xs text-gray-400 mb-2">
                        Database Schema Used:
                      </div>
                      <div className="text-xs font-mono text-gray-300 bg-gray-900 p-3 rounded border max-h-20 overflow-y-auto">
                        {generatedSQL.schema}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SparklesIcon className="h-8 w-8 text-white" />
                      </div>
                      <p className="text-gray-400 mb-2">
                        Your generated SQL will appear here
                      </p>
                      <p className="text-sm text-gray-500">
                        Type a question in the left panel to get started
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        }
      />

      {/* Results Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full min-h-[900px] max-h-[90vh] flex flex-col border border-gray-700 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-900 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-100">
                    Query Results
                  </h2>
                  <p className="text-sm text-gray-400">
                    {queryResults.length} rows returned
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportToExcel}
                  className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                  Export CSV
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-4 min-h-0 flex flex-col opacity-100 overflow-hidden">
              {queryResults.length > 0 ? (
                <div className="flex-1 overflow-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900 sticky top-0">
                      <tr>
                        {Object.keys(queryResults[0]).map((header) => (
                          <th
                            key={header}
                            className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {queryResults.map((row, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-700 transition-colors"
                        >
                          {Object.values(row).map((value, cellIndex) => (
                            <td
                              key={cellIndex}
                              className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                            >
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-400">No results to display</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-4 border-t border-gray-700 bg-gray-900">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Explain SQL Modal */}
      {isExplainOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl max-w-md w-full shadow-2xl border border-gray-700">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-blue-400" />
              SQL Explanation
            </h2>
            <p className="text-gray-200 whitespace-pre-line">{explanation}</p>
            <button
              onClick={() => setIsExplainOpen(false)}
              className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App Router
export default function App() {
  return (
    <AppProvider>
      <QueryHistoryProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<MainApp />} />
          </Routes>
        </Router>
      </QueryHistoryProvider>
    </AppProvider>
  );
}
