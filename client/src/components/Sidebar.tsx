import { navigation, classNames } from "./navigation";
import { ServerIcon } from "@heroicons/react/24/outline";

export default function Sidebar() {
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
    </div>
  );
}
