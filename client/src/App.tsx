import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useState } from "react";
import {
  DocumentTextIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  PlayIcon,
  ArrowDownTrayIcon,
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
  LoginForm,
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
  const [, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsAuthenticated(true);
    setIsLoading(false);

    // Navigate to app after successful login
    navigate("/app");
  };

  return (
    <div className="h-screen w-screen bg-gray-900 overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-blue-600/10"></div>
      </div>

      {/* Side-by-Side Layout */}
      <div className="flex h-full w-full relative z-10 justify-center">
        <div className="flex w-full max-w-7xl">
          {/* Left Section - App Description & Features */}
          <div className="w-2/5 flex flex-col justify-center px-8 py-12">
            <div className="w-full max-w-lg">
              {/* Logo and Title */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  <div className="relative mr-4">
                    <div className="w-12 h-12 bg-blue-600 border-2 border-blue-400 flex items-center justify-center shadow-lg">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-white">
                    SQL AI Assistant
                  </h1>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Transform natural language to SQL instantly
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      No coding required - just ask what you want to know about your data in plain English.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Start analyzing data immediately
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Upload your database schema and start asking questions right away with our intuitive interface.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-orange-400 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Trusted by data professionals
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Join analysts, developers, and business users who rely on our AI-powered SQL generation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-12 p-4 border border-orange-400/30 rounded-lg bg-orange-400/10">
                <p className="text-orange-300 text-sm">
                  <span className="font-medium">Did you know?</span> Our AI understands complex database schemas and generates optimized SQL queries for better performance.
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Sign In Form Card */}
          <div className="w-3/5 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-md flex justify-center">
              <div className="bg-white shadow-2xl p-8 w-full">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Sign In
                </h2>

                <LoginForm onLogin={handleLogin} isLoading={isLoading} />
              </div>
            </div>
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
  const [currentDatabase, setCurrentDatabase] = useState<string | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<"sql" | "csv" | null>(null);
  const { addQuery } = useQueryHistory();
  const { currentSchema } = useApp();

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
    
    // Determine file type from extension
    const fileType = file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'sql';
    console.log("Detected file type:", fileType);
    
    // Update the database state directly
    setCurrentDatabase(file.name);
    setSelectedDatabase(fileType);
    
    // Also trigger refresh for API calls
    setRefreshTrigger((prev) => prev + 1);
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
      const response = await api.runSQL(
        generatedSQL.sql_query,
        currentSchema || undefined
      );
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
    <div className="bg-gray-900 min-h-screen relative">
      {/* Dotted Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle, #4B5563 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}></div>
      </div>
      
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <TopBar setSidebarOpen={setSidebarOpen} />
      <Layout
        leftChildren={
          <div className="space-y-12 relative z-10">
            {/* File Upload Section */}
            <div>
              <FileUpload
                onFileUpload={handleFileUpload}
                isSelected={selectedSection === "upload"}
                onSelect={() => setSelectedSection("upload")}
              />
            </div>



            {/* Natural Language to SQL Section */}
            <div>
              <QueryAnalyzer
                onAnalyze={handleSchemaAnalysis}
                isSelected={selectedSection === "query"}
                onSelect={() => setSelectedSection("query")}
                refreshTrigger={refreshTrigger}
                currentDatabase={currentDatabase}
                selectedDatabase={selectedDatabase}
                setSelectedDatabase={setSelectedDatabase}
              />
            </div>
          </div>
        }
        rightChildren={
          <div className="h-full flex flex-col">
            {/* Railway-Style Fixed Panel */}
            <div className="w-full h-full bg-gray-900 rounded-t-xl shadow-2xl border border-gray-700 border-b-0 overflow-hidden flex flex-col relative z-20" style={{ backgroundColor: '#111827' }}>
              {/* Panel Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                    <DocumentTextIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-100">
                      SQL Query Engine
                    </h2>
                    <p className="text-sm text-gray-400">
                      Natural language to SQL conversion
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-200 hover:bg-gray-800 rounded-lg transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Panel Tabs */}
              <div className="flex border-b border-gray-700 bg-gray-800">
                <button className="px-6 py-3 text-sm font-medium text-blue-400 border-b-2 border-blue-500 bg-gray-800">
                  Generated SQL
                </button>
                <button className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-700 transition-colors">
                  Schema
                </button>
                <button className="px-6 py-3 text-sm font-medium text-gray-400 hover:text-gray-300 hover:bg-gray-700 transition-colors">
                  History
                </button>
              </div>

              {/* Panel Content */}
              <div className="flex-1 bg-gray-900 overflow-hidden relative z-10">
                {generatedSQL ? (
                  <div className="h-full flex flex-col">
                    {/* SQL Query Header */}
                    <div className="p-6 border-b border-gray-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <h4 className="text-base font-semibold text-gray-200">
                            Active Query
                          </h4>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={handleRunQuery}
                            disabled={isRunningQuery}
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
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
                            Explain
                          </button>
                        </div>
                      </div>
                      
                      {/* SQL Query Display */}
                      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
                        <HighlightedCode
                          key={generatedSQL.sql_query}
                          language="sql"
                          code={generatedSQL.sql_query}
                        />
                      </div>
                    </div>

                    {/* Schema Info */}
                    <div className="flex-1 p-6">
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-300 mb-2">
                          Database Schema
                        </h5>
                        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 max-h-32 overflow-y-auto">
                          <div className="text-xs font-mono text-gray-300">
                            {generatedSQL.schema}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SparklesIcon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-200 mb-2">
                        Ready to Generate SQL
                      </h3>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        Type your question in the left panel to convert natural language to SQL
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
          <div className="bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full min-h-[900px] max-h-[90vh] flex flex-col border border-gray-700 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
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
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm hover:shadow-md"
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
            <div className="flex-1 p-6 min-h-0 flex flex-col opacity-100 overflow-hidden bg-gray-900">
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
