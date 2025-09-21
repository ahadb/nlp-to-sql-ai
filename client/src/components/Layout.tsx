import type { ReactNode } from "react";
import { ChartBarIcon, XMarkIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface LayoutProps {
  leftChildren: ReactNode | null;
  rightChildren?: ReactNode;
  isDrawerOpen?: boolean;
  setIsDrawerOpen?: (open: boolean) => void;
  drawerTriggerLabel?: string;
}

export default function Layout({ 
  leftChildren, 
  rightChildren, 
  isDrawerOpen = false,
  setIsDrawerOpen,
  drawerTriggerLabel = "Results"
}: LayoutProps) {
  return (
    <>
      <main className="lg:pl-52 min-h-screen bg-[#1a1a1a] relative">
        {/* Main Content Area */}
        <div className="min-h-screen bg-[#1a1a1a]">
          {leftChildren && (
            <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6">
              <div className="max-w-6xl mx-auto">
                {leftChildren}
              </div>
            </div>
          )}
        </div>


        {/* Slide-out Drawer */}
        {rightChildren && (
          <>
            {/* Backdrop */}
            {isDrawerOpen && (
              <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                onClick={() => setIsDrawerOpen?.(false)}
              />
            )}
            
            {/* Drawer Panel */}
            <div className={`
              fixed top-0 right-0 h-full bg-[#1a1a1a] border-l border-gray-800/50 shadow-2xl z-50
              transform transition-transform duration-300 ease-in-out
              ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
              w-full sm:w-[480px] lg:w-[520px] xl:w-[600px]
            `}>
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-[#262626]">
                <div className="flex items-center space-x-3">
                  <SparklesIcon className="h-6 w-6 text-gray-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Assistant</h3>
                    <p className="text-sm text-gray-400">Ask questions in natural language</p>
                  </div>
                </div>
                {setIsDrawerOpen && (
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors duration-200"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
              
              {/* Drawer Content */}
              <div className="h-full overflow-y-auto pb-20">
                {rightChildren}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
