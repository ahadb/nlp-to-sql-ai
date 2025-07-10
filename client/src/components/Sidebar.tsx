import { navigation, classNames } from "./navigation";

export default function Sidebar() {
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-20 lg:overflow-y-auto lg:bg-gray-900 lg:pb-4">
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
                    ? "bg-gray-800 text-white"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white",
                  "group flex gap-x-3 rounded-md p-3 text-sm/6 font-semibold"
                )}
              >
                <item.icon aria-hidden="true" className="size-6 shrink-0" />
                <span className="sr-only">{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
