import { useState } from "react";
import {
  DocumentTextIcon,
  SparklesIcon,
  ClipboardDocumentIcon,
  CheckIcon,
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
    </>
  );
}
