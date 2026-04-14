import React, { useState, useEffect } from "react";
import { Sidebar, MobileSidebar, TopBar, Layout, MyDataTab, AIChatDrawer } from "./index";
import { api } from "../services/api";

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hasData, setHasData] = useState(false);

  // Check for existing data on page load
  useEffect(() => {
    const checkForExistingData = async () => {
      try {
        const [dataSourcesResponse, tablesResponse] = await Promise.all([
          api.getDataSources(),
          api.getTables()
        ]);
        
        const hasDataSources = dataSourcesResponse.schemas && dataSourcesResponse.schemas.length > 0;
        const hasTables = tablesResponse.tables && tablesResponse.tables.length > 0;
        
        if (hasDataSources || hasTables) {
          setHasData(true);
        }
      } catch (error) {
        console.log('No existing data found on page load:', error);
      }
    };
    
    checkForExistingData();
  }, []);

  return (
    <div className="bg-[#1a1a1a] min-h-screen relative">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <TopBar setSidebarOpen={setSidebarOpen} />
      <Layout
        leftChildren={<MyDataTab onOpenAIChat={() => setIsDrawerOpen(true)} hasData={hasData} setHasData={setHasData} />}
        rightChildren={<AIChatDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} hasData={hasData} />}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        drawerTriggerLabel="Ask AI"
      />
    </div>
  );
};

export default DashboardPage;
