import { Bars3Icon, BellIcon, MagnifyingGlassIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useLocation } from "react-router-dom";

interface TopBarProps {
  setSidebarOpen: (open: boolean) => void;
}

const getPageTitle = (pathname: string) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/tables':
      return 'Data Tables';
    case '/reports':
      return 'Reports';
    case '/connections':
      return 'Connections';
    default:
      return 'Dashboard';
  }
};

export default function TopBar({ setSidebarOpen }: TopBarProps) {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900/30 px-4 py-4 shadow-xs sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
        <div className="flex-1 text-sm/6 font-semibold text-white">{pageTitle}</div>
        <a href="#">
          <span className="sr-only">Your profile</span>
          <img
            alt=""
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="size-8 rounded-full bg-gray-800"
          />
        </a>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block lg:pl-52 sticky top-0 z-30 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            {/* Breadcrumb with Organization */}
            <div className="flex items-center space-x-2 text-sm">
              <span className="text-gray-400">Demo Org</span>
              <ChevronRightIcon className="h-3 w-3 text-gray-500" />
              <span className="text-white font-medium">{pageTitle}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200">
              <BellIcon className="h-5 w-5" />
            </button>
            
            {/* Profile */}
            <div className="flex items-center space-x-3">
              <img
                alt="Profile"
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                className="h-8 w-8 rounded-full bg-gray-800"
              />
              <div className="text-sm">
                <div className="text-white font-medium">Demo User</div>
                <div className="text-gray-400">demo@datamind.ai</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
