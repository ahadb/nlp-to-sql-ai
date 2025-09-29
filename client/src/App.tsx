import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import {
  SparklesIcon,
} from "@heroicons/react/24/outline";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
  DataTablesTab,
  DashboardPage,
  DataTablesPage,
  DemoPage,
  ReportsPage,
  ConnectionsPage,
  ResultsDashboard,
  SettingsPage,
} from "./components";
import {
  QueryHistoryProvider,
} from "./contexts/QueryHistoryContext";
import { AppProvider } from "./contexts/AppContext";

interface GeneratedSQL {
  question: string;
  sql_query: string;
  schema: string;
}

// Main App Component
function MainApp() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generatedSQL, setGeneratedSQL] = useState<GeneratedSQL | null>(null);
  const [selectedSection, setSelectedSection] = useState<
    "query" | "upload" | null
  >("upload");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [queryResults, ] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentDatabase, setCurrentDatabase] = useState<string | null>(null);
  const [selectedDatabase, setSelectedDatabase] = useState<"sql" | "csv" | null>(null);
  const [isResultsFullWidth, setIsResultsFullWidth] = useState(false);

  // Determine active tab from URL
  const getActiveTabFromPath = (pathname: string) => {
    if (pathname.includes('/app/tables')) return 'Data Tables';
    if (pathname.includes('/app/reports')) return 'Reports';
    if (pathname.includes('/app/connections')) return 'Connections';
    return 'Dashboard'; // Default
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  const setActiveTab = (tab: string) => {
    const routes = {
      'Dashboard': '/app/dashboard',
      'Data Tables': '/app/tables',
      'Reports': '/app/reports',
      'Connections': '/app/connections'
    };
    navigate(routes[tab as keyof typeof routes] || '/app/dashboard');
  };

  // Redirect /app to /app/dashboard
  useEffect(() => {
    if (location.pathname === '/app') {
      navigate('/app/dashboard', { replace: true });
    }
  }, [location.pathname, navigate]);

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
      setIsDrawerOpen(true);
    }
  };

  return (
    <div className="bg-[#0f0f0f] min-h-screen relative">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <TopBar setSidebarOpen={setSidebarOpen} />
      <Layout
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        drawerTriggerLabel="View Results"
        leftChildren={
          isResultsFullWidth ? null : (
            activeTab === "Dashboard" ? (
              <MyDataTab />
            ) : activeTab === "Data Tables" ? (
              <DataTablesTab />
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
          )
        }
        rightChildren={
          <ResultsDashboard 
            isFullWidth={isResultsFullWidth}
            setIsFullWidth={setIsResultsFullWidth}
            queryResult={generatedSQL ? {
              id: '1',
              question: generatedSQL.question,
              results: queryResults,
              insights: [],
              recommendations: [],
              timestamp: 'Just now'
            } : null}
          />
        }
      />
    </div>
  );
}

// Main App Router
export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <QueryHistoryProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MarketingLandingPage />} />
              <Route path="/login" element={<AuthPage mode="login" />} />
              <Route path="/signup" element={<AuthPage mode="signup" />} />
              <Route path="/demo" element={
                <ProtectedRoute>
                  <DemoPage />
                </ProtectedRoute>
              } />
              <Route path="/app" element={
                <ProtectedRoute>
                  <MainApp />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/tables" element={
                <ProtectedRoute>
                  <DataTablesPage />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              } />
              <Route path="/connections" element={
                <ProtectedRoute>
                  <ConnectionsPage />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </QueryHistoryProvider>
      </AppProvider>
    </AuthProvider>
  );
}
