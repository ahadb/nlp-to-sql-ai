import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import { XMarkIcon, ArrowRightOnRectangleIcon, } from "@heroicons/react/24/outline";
import { navigation, classNames } from "./navigation";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface MobileSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function MobileSidebar({
  sidebarOpen,
  setSidebarOpen,
}: MobileSidebarProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      setSidebarOpen(false); // Close sidebar first
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };
  return (
    <Dialog
      open={sidebarOpen}
      onClose={setSidebarOpen}
      className="relative z-50 lg:hidden"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
      />

      <div className="fixed inset-0 flex">
        <DialogPanel
          transition
          className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
        >
          <TransitionChild>
            <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="-m-2.5 p-2.5"
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon aria-hidden="true" className="size-6 text-white" />
              </button>
            </div>
          </TransitionChild>

          <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
            <div className="flex h-16 shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="-mx-2 flex-1 space-y-1">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <a
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-800 text-white"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white",
                        "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold"
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className="size-6 shrink-0"
                      />
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>

              {/* Logout - Mobile */}
              <div className="mt-auto border-t border-gray-700 pt-4">
                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-6 w-6" />
                  Sign Out
                </button>
              </div>
            </nav>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
