import React, { useState } from "react";
import { Sidebar, MobileSidebar, TopBar, Layout, MyDataTab, AIChatDrawer } from "./index";

const DashboardPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="bg-[#1a1a1a] min-h-screen relative">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <TopBar setSidebarOpen={setSidebarOpen} />
      <Layout
        leftChildren={<MyDataTab onOpenAIChat={() => setIsDrawerOpen(true)} />}
        rightChildren={<AIChatDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        drawerTriggerLabel="Ask AI"
      />
    </div>
  );
};

export default DashboardPage;
