import React, { useState } from "react";
import { Sidebar, MobileSidebar, TopBar, DataTablesTab, AIChatDrawer } from "./index";
import { XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";

const DataTablesPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [initialTemplate, setInitialTemplate] = useState<string | null>(null);
  const [customTemplates, setCustomTemplates] = useState<any[] | null>(null);
  const [activeTableName, setActiveTableName] = useState<string | null>(null);

  return (
    <div className="bg-[#1a1a1a] min-h-screen relative">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <TopBar setSidebarOpen={setSidebarOpen} />
      
      {/* Full-width layout for tables */}
      <main className="lg:pl-52 h-screen">
        <div className="h-full -ml-5">
          <DataTablesTab 
            onOpenAIChat={(templateMessage, templates, tableName) => {
              setInitialTemplate(templateMessage ?? null);
              setCustomTemplates(templates || null);
              setActiveTableName(tableName ?? null);
              setIsDrawerOpen(true);
            }} 
          />
        </div>
      </main>

      {/* AI Chat Drawer */}
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsDrawerOpen(false)}
          />
          
          {/* Drawer Panel */}
          <div className="fixed top-0 right-0 h-full bg-[#1a1a1a] border-l border-gray-800/50 shadow-2xl z-50 w-full sm:w-[480px] lg:w-[520px] xl:w-[600px] transform transition-transform duration-300 ease-in-out">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-[#262626]">
              <div className="flex items-center space-x-3">
                <SparklesIcon className="h-6 w-6 text-gray-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                  <p className="text-sm text-gray-400">Ask questions in natural language</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            {/* Drawer Content */}
            <div className="h-full overflow-y-auto pb-20">
              <AIChatDrawer 
                isOpen={isDrawerOpen} 
                onClose={() => {
                  setIsDrawerOpen(false);
                  setInitialTemplate(null);
                  setCustomTemplates(null);
                  setActiveTableName(null);
                }}
                initialTemplate={initialTemplate}
                customTemplates={customTemplates ?? undefined}
                activeTableName={activeTableName}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DataTablesPage;
