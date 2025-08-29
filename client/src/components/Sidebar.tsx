import { navigation, classNames } from "./navigation";
import QueryHistory from "./QueryHistory";
import { useQueryHistory } from "../contexts/QueryHistoryContext";
import { useApp } from "../contexts/AppContext";
import { type QueryHistoryItem } from "../types/query";

export default function Sidebar() {
  const { state, clearHistory } = useQueryHistory();
  const { populateQueryInput } = useApp();

  const handleQuerySelect = (query: QueryHistoryItem) => {
    populateQueryInput(query);
  };

  const handleReRunQuery = (sql: string) => {
    // This will be handled by the parent component
    console.log("Re-run query requested:", sql);
  };

  const handleClearHistory = () => {
    localStorage.removeItem("queryHistory");
    clearHistory();
  };

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-48 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4 border-r border-gray-700" style={{boxShadow: '4px 0 15px rgba(0, 0, 0, 0.3)'}}>
      <div className="flex h-16 shrink-0 items-center px-4">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 bg-blue-600 border-2 border-blue-400 flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
          </div>
          <div className="ml-3">
            <div className="text-lg font-bold text-gray-100">SQL AI</div>
            <div className="text-xs text-gray-400 font-medium">Assistant</div>
          </div>
        </div>
      </div>

      <nav className="mt-8 px-3">
        <ul role="list" className="flex flex-col space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-gray-100",
                  "group flex items-center gap-x-3 rounded-md p-2 text-sm/6 font-semibold transition-colors duration-200 h-8"
                )}
              >
                <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <item.icon aria-hidden="true" className="size-5" />
                </div>
                <span className="ml-3 flex items-center">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Recent Queries Section */}
      <div className="mt-8 px-3">
        <QueryHistory
          queries={state.queries}
          onQuerySelect={handleQuerySelect}
          onReRunQuery={handleReRunQuery}
        />

        {/* Clear History Button */}
        {state.queries.length > 0 && (
          <div className="mt-4">
            <button
              onClick={handleClearHistory}
              className="w-full px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-md transition-colors duration-200 border border-red-800/30 hover:border-red-700/50"
            >
              Clear History
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
