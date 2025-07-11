import type { ReactNode } from "react";

interface LayoutProps {
  leftChildren: ReactNode;
  rightChildren?: ReactNode;
}

export default function Layout({ leftChildren, rightChildren }: LayoutProps) {
  return (
    <>
      <main className="lg:pl-20 h-screen">
        <div className="xl:grid xl:grid-cols-2 xl:gap-0 h-full">
          <div className="px-4 py-10 sm:px-6 lg:px-8 lg:py-6 border-r border-gray-200 h-full overflow-y-auto">
            {leftChildren}
          </div>

          <aside className="hidden xl:block px-4 py-10 sm:px-6 lg:px-8 lg:py-6 bg-gray-50 h-full overflow-y-auto">
            {rightChildren || (
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  Secondary Panel
                </h2>
                <p className="mt-2 text-gray-600">
                  This is the right section with equal width.
                </p>
              </div>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}
