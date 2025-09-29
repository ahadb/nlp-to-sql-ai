import { Bars3Icon, ChevronRightIcon, ArrowRightOnRectangleIcon, UserCircleIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect, useRef } from "react";

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
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pageTitle = getPageTitle(location.pathname);

  // Generate initials from user's name
  const getInitials = (name: string) => {
    if (!name) return 'DU'; // Default for Demo User
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  const userInitials = getInitials(user?.full_name || "Demo User");

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900/30 px-4 py-2 shadow-xs sm:px-6 lg:hidden">
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
          <div className="size-8 rounded-full bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{userInitials}</span>
          </div>
        </a>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block lg:pl-52 sticky top-0 z-30 bg-[#0f0f0f]/95 backdrop-blur-sm border-b border-gray-700/50">
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex items-center space-x-4">
            {/* Breadcrumb with Organization */}
            <div className="flex items-center space-x-2 text-sm">
              <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
              <button 
                onClick={() => navigate('/settings')}
                className="text-indigo-400 hover:text-indigo-300 transition-colors duration-200 cursor-pointer"
              >
                Demo Org
              </button>
              <ChevronRightIcon className="h-3 w-3 text-gray-500" />
              <span className="text-white font-medium">{pageTitle}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
              >
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">{userInitials}</span>
                </div>
                <div className="text-sm text-left">
                  <div className="text-white font-medium">{user?.full_name || "Demo User"}</div>
                  <div className="text-gray-400">{user?.email}</div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/settings');
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white w-full text-left transition-colors duration-200"
                    >
                      <UserCircleIcon className="h-4 w-4 mr-3" />
                      Profile Settings
                    </button>
                    <hr className="border-gray-600 my-1" />
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        handleSignOut();
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-red-400 w-full text-left transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
