import { useState } from "react";
import {
  DocumentTextIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  PlayIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

import {
  Sidebar,
  MobileSidebar,
  TopBar,
  Layout,
  FileUpload,
  QueryAnalyzer,
  StepIndicator,
} from "./components";
import HighlightedCode from "./components/CodeHighlighter";
import { api } from "./services/api";

interface GeneratedSQL {
  question: string;
  sql_query: string;
  schema: string;
}

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState<GeneratedSQL | null>(null);
  const [hasUploadedSchema, setHasUploadedSchema] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSection, setSelectedSection] = useState<
    "query" | "upload" | null
  >("upload");
  const [isCopied, setIsCopied] = useState(false);
  const [isRunningQuery, setIsRunningQuery] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [queryResults, setQueryResults] = useState<any[]>([]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Hide after 2 seconds
      // You could add a toast notification here
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleFileUpload = (file: File) => {
    console.log("File uploaded successfully:", file.name);
    setHasUploadedSchema(true);
    setCurrentStep(2);
    // The actual upload is now handled in the FileUpload component
    // This callback can be used for additional actions after successful upload
  };

  const handleSchemaAnalysis = (query: string, sqlData?: GeneratedSQL) => {
    console.log("Schema analysis requested:", query);
    if (sqlData) {
      setGeneratedSQL(sqlData);
    }
  };

  const handleRunQuery = async () => {
    if (!generatedSQL) return;

    setIsRunningQuery(true);
    try {
      console.log("Running query:", generatedSQL.sql_query);

      // Call the actual API endpoint
      const response = await api.runSQL(generatedSQL.sql_query);
      console.log("API Response:", response);

      // Set the results from the API response
      setQueryResults(response.data || []);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error running query:", error);
      // Show error in modal or as a toast
      alert(
        `Error running query: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsRunningQuery(false);
    }
  };

  const exportToExcel = () => {
    if (queryResults.length === 0) return;

    // Convert data to CSV format
    const headers = Object.keys(queryResults[0]);
    const csvContent = [
      headers.join(","),
      ...queryResults.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma or newline
            const escapedValue = String(value).replace(/"/g, '""');
            return `"${escapedValue}"`;
          })
          .join(",")
      ),
    ].join("\n");

    // Create and download file
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
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-white">
        <body class="h-full">
        ```
      */}
      <div>
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
              <div className="border-t border-gray-200 my-8 -mx-4 sm:-mx-6 lg:-mx-8"></div>

              {/* Natural Language to SQL Section */}
              <div>
                <QueryAnalyzer
                  onAnalyze={handleSchemaAnalysis}
                  isSelected={selectedSection === "query"}
                  onSelect={() => setSelectedSection("query")}
                />
              </div>
            </div>
          }
          rightChildren={
            <div
              className="h-full flex flex-col space-y-8"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #e5e7eb 10px, #e5e7eb 20px)",
              }}
            >
              {/* SQL Display Card */}
              <div className="w-full p-6 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 bg-white flex-1 flex flex-col">
                {/* Step Title with Border */}
                <div className="mb-6 pb-3 border-b border-gray-200 -mx-6 px-6 bg-gray-50 -mt-6 pt-4 flex-shrink-0">
                  <div className="mb-2">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-600">
                        <DocumentTextIcon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-0">
                          Generated SQL
                        </h3>
                        <p className="text-xs text-gray-600 leading-none mt-0.5">
                          Your generated SQL query will appear here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SQL Content */}
                <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 overflow-hidden min-h-0">
                  {generatedSQL ? (
                    <div className="h-full flex flex-col">
                      {/* SQL Query */}
                      <div className="flex-1 overflow-auto">
                        <div className="flex justify-between items-start p-4 -mb-6">
                          <h4 className="text-sm font-semibold text-gray-700">
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
                              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Copy SQL to clipboard"
                            >
                              {isCopied ? (
                                <CheckIcon className="h-5 w-5 text-green-500" />
                              ) : (
                                <ClipboardDocumentIcon className="h-5 w-5" />
                              )}
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
                      <div className="border-t border-gray-200 bg-white p-4">
                        <div className="text-xs text-gray-500 mb-2">
                          Database Schema Used:
                        </div>
                        <div className="text-xs font-mono text-gray-700 bg-gray-50 p-3 rounded border max-h-20 overflow-y-auto">
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
                        <p className="text-gray-500 mb-2">
                          Your generated SQL will appear here
                        </p>
                        <p className="text-sm text-gray-400">
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
      </div>

      {/* Results Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-400/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full min-h-[900px] max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Query Results
                  </h2>
                  <p className="text-xs text-gray-500">
                    {queryResults.length} row
                    {queryResults.length !== 1 ? "s" : ""} returned
                  </p>
                </div>
              </div>

              {/* Filters Section */}
              <div className="flex items-center space-x-3">
                {/* Sort Filter */}
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors">
                    <option value="">Sort by...</option>
                    <option value="name">Name</option>
                    <option value="date">Date</option>
                    <option value="amount">Amount</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button className="p-1.5 text-blue-600 bg-white rounded-md shadow-sm transition-all duration-200">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                    </svg>
                  </button>
                  <button className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md transition-colors">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
                    </svg>
                  </button>
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search results..."
                    className="w-48 pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400 transition-colors"
                  />
                  <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Export Button */}
                <button
                  onClick={exportToExcel}
                  disabled={queryResults.length === 0}
                  className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 disabled:bg-gray-100 disabled:text-gray-400 rounded-md transition-colors border border-blue-200 hover:border-blue-300"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1.5" />
                  Export CSV
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <svg
                    className="w-5 h-5"
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
            <div className="flex-1 p-4 min-h-0 flex flex-col opacity-100">
              {queryResults.length > 0 ? (
                <div className="border border-gray-200 opacity-100 rounded-lg overflow-hidden bg-white shadow-sm flex-1 flex flex-col min-h-0">
                  <div className="flex-1 overflow-auto">
                    <div className="min-w-full min-h-full overflow-auto">
                      <table
                        className="min-w-full divide-y divide-gray-100"
                        style={{ minWidth: "max-content" }}
                      >
                        {/* Table Header */}
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            {Object.keys(queryResults[0]).map(
                              (column, index) => (
                                <th
                                  key={index}
                                  className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-100 last:border-r-0 bg-gray-50"
                                >
                                  {column}
                                </th>
                              )
                            )}
                          </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody className="bg-white divide-y divide-gray-50">
                          {queryResults.map((row, rowIndex) => (
                            <tr
                              key={rowIndex}
                              className="hover:bg-blue-50 transition-colors duration-150"
                            >
                              {Object.values(row).map((value, colIndex) => (
                                <td
                                  key={colIndex}
                                  className="px-4 py-2.5 whitespace-nowrap text-sm text-gray-700 border-r border-gray-50 last:border-r-0"
                                >
                                  <div
                                    className="max-w-xs truncate"
                                    title={String(value)}
                                  >
                                    {String(value)}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-500">
                  <div className="text-center">
                    <svg
                      className="w-12 h-12 mx-auto mb-3 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-sm">No data returned</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 rounded-md transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
