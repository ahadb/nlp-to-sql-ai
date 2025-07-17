import { navigation, classNames } from "./navigation";
import {
  ServerIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar() {
  // Mock data for recent queries
  const recentQueries = [
    {
      id: 1,
      question: "Show me top 10 customers by order value",
      timestamp: "2 hours ago",
      resultCount: 10,
    },
    {
      id: 2,
      question: "Which products have highest sales volume?",
      timestamp: "4 hours ago",
      resultCount: 25,
    },
    {
      id: 3,
      question: "Break down sales by region and country",
      timestamp: "1 day ago",
      resultCount: 15,
    },
    {
      id: 4,
      question: "Employee performance with total sales",
      timestamp: "2 days ago",
      resultCount: 8,
    },
    {
      id: 5,
      question: "Monthly order trends for last 2 years",
      timestamp: "3 days ago",
      resultCount: 24,
    },
  ];

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-48 lg:overflow-y-auto lg:bg-gray-200 lg:pb-4 border-r border-gray-300">
      <div className="flex h-16 shrink-0 items-center px-4">
        <div className="p-2 border-2 border-blue-600 rounded-full bg-white">
          <ServerIcon className="h-6 w-6 text-blue-600" />
        </div>
        <span className="text-lg font-bold text-gray-800 ml-3">SQL AI</span>
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
                    : "text-gray-400 hover:bg-gray-300 hover:text-gray-700",
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
        <div className="flex items-center gap-2 mb-3">
          <ClockIcon className="h-4 w-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-800">
            Recent Queries
          </h3>
        </div>
        <div className="space-y-2">
          {recentQueries.map((query) => (
            <div
              key={query.id}
              className="group p-2 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-center gap-1.5 min-w-0 mb-1">
                <MagnifyingGlassIcon className="h-3 w-3 text-blue-500 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-700 truncate">
                  {query.question}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{query.timestamp}</span>
                <span className="text-xs px-1 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                  {query.resultCount} results
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
