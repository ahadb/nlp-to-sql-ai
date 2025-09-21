import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
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
  MarketingLandingPage,
  AuthPage,
  MyDataTab,
  ResultsDashboard,
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

// Main App Component
function MainApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState<GeneratedSQL | null>(null);
  const [selectedSection, setSelectedSection] = useState<
    "query" | "upload" | null
  >("upload");
  const [activeTab, setActiveTab] = useState<string>("My Data");
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
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const { addQuery } = useQueryHistory();
  const { currentSchema } = useApp();

  const handleFileUpload = (file: File) => {
    console.log("File uploaded successfully:", file.name);
    const fileType = file.name.toLowerCase().endsWith('.csv') ? 'csv' : 'sql';
    setCurrentDatabase(file.name);
    setSelectedDatabase(fileType);
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleSchemaAnalysis = (query: string, sqlData?: GeneratedSQL) => {
    console.log("Schema analysis requested:", query);
    if (sqlData) {
      setGeneratedSQL(sqlData);
      setLastNLQuery(query);
      setIsDrawerExpanded(true);
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen relative">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <TopBar setSidebarOpen={setSidebarOpen} />
      <Layout
        leftChildren={
          activeTab === "My Data" ? (
            <MyDataTab />
          ) : (
          <div className="space-y-12 relative z-10">
            {/* Vision Section */}
            <div className="bg-gray-800/30 border border-gray-600/50 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center flex-shrink-0">
                  <SparklesIcon className="h-8 w-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    The Future of Business Intelligence
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    You're experiencing our <strong>MVP demo</strong> with file uploads. Our vision: <strong>one-click connections</strong> to your live business data.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-3 text-sm text-gray-300">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full shadow-lg shadow-cyan-400/50"></div>
                      <span className="font-medium">Google Sheets</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-300">
                      <div className="w-3 h-3 bg-blue-400 rounded-full shadow-lg shadow-blue-400/50"></div>
                      <span className="font-medium">Shopify Stores</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-300">
                      <div className="w-3 h-3 bg-purple-400 rounded-full shadow-lg shadow-purple-400/50"></div>
                      <span className="font-medium">Stripe Payments</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm text-gray-300">
                      <div className="w-3 h-3 bg-pink-400 rounded-full shadow-lg shadow-pink-400/50"></div>
                      <span className="font-medium">HubSpot CRM</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-4">
                    <p className="text-sm text-cyan-300 font-semibold">
                      <strong>Coming Soon:</strong> One-click connections to your business tools. Ask questions about live data instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

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
          )
        }
        rightChildren={
          <div className="h-full flex flex-col justify-end relative z-50 bg-gray-950">
            <ResultsDashboard 
              isExpanded={isDrawerExpanded}
              setIsExpanded={setIsDrawerExpanded}
              queryResult={generatedSQL ? {
                id: '1',
                question: generatedSQL.question,
                results: queryResults,
                insights: [],
                recommendations: [],
                timestamp: 'Just now'
              } : null}
            />
          </div>
        }
      />
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
            <Route path="/" element={<MarketingLandingPage />} />
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/signup" element={<AuthPage mode="signup" />} />
            <Route path="/app" element={<MainApp />} />
          </Routes>
        </Router>
      </QueryHistoryProvider>
    </AppProvider>
  );
}
