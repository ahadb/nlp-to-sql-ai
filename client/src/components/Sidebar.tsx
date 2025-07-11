import { navigation, classNames } from "./navigation";

export default function Sidebar() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-200 lg:pb-4 border-r border-gray-300">
      <div className="flex h-16 shrink-0 items-center justify-center">
        <img
          alt="Your Company"
          src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
          className="h-8 w-auto"
        />
      </div>
      <nav className="mt-8">
        <ul role="list" className="flex flex-col items-center space-y-1">
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-blue-600 text-white"
                    : "text-gray-400 hover:bg-gray-300 hover:text-gray-700",
                  "group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold transition-colors duration-200"
                )}
              >
                <item.icon aria-hidden="true" className="size-5 shrink-0" />
                <span className="sr-only">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
