import { Link, useLocation } from "react-router-dom";
import { navigation, classNames } from "./navigation";
import { CircleStackIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const location = useLocation();

  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-48 lg:overflow-y-auto lg:bg-[#0f0f0f] lg:pb-4 border-r border-gray-600/30" style={{boxShadow: '4px 0 15px rgba(0, 0, 0, 0.3)'}}>
      <div className="flex h-16 shrink-0 items-center px-4">
        <div className="flex items-center">
          <div className="text-lg font-bold text-white">DataMind AI</div>
        </div>
      </div>

      <nav className="mt-8 px-3">
        <ul role="list" className="flex flex-col space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className={classNames(
                  location.pathname === item.href
                    ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/50 text-blue-300 shadow-sm shadow-blue-500/20"
                    : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-500/30 border border-transparent",
                  "group flex items-center gap-x-3 rounded-lg p-2 text-sm/6 font-semibold transition-all duration-200 h-8 w-full text-left"
                )}
              >
                <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                  <item.icon aria-hidden="true" className="size-5" />
                </div>
                <span className="ml-3 flex items-center">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Divider */}
      <div className="mt-4 mx-3 border-t border-gray-500/70"></div>

      {/* Settings */}
      <div className="mt-3 px-3">
        <Link
          to="/settings"
          className={classNames(
            location.pathname === '/settings'
              ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/50 text-blue-300 shadow-sm shadow-blue-500/20"
              : "text-gray-300 hover:bg-blue-500/10 hover:text-blue-300 hover:border-blue-500/30 border border-transparent",
            "group flex items-center gap-x-3 rounded-lg p-2 text-sm/6 font-semibold transition-all duration-200 h-8 w-full text-left"
          )}
        >
          <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
            <Cog6ToothIcon aria-hidden="true" className="size-5" />
          </div>
          <span className="ml-3 flex items-center">Settings</span>
        </Link>
      </div>

    </div>
  );
}
