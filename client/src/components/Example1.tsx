export default function Example1() {

  return (
    <div className="bg-indigo-950">
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto max-w-7xl">
          <div className="px-6 pt-6 lg:max-w-2xl lg:pr-0 lg:pl-8">
            <nav aria-label="Global" className="flex items-center justify-start">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">DataMind AI</span>
                <span className="text-xl font-bold text-white">DataMind AI</span>
              </a>
            </nav>
          </div>
        </div>
      </header>

      <div className="relative">
        <div className="mx-auto max-w-7xl">
            
            
            
          <div className="relative z-10 pt-14 lg:w-full lg:max-w-2xl">
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="absolute inset-y-0 right-8 hidden h-full w-80 translate-x-1/2 transform fill-indigo-950 lg:block"
            >
              <polygon points="0,0 90,0 50,100 0,100" />
            </svg>

            

            <div className="relative px-6 py-24 sm:py-28 lg:px-8 lg:py-36 lg:pr-0">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
                <div className="hidden sm:mb-10 sm:flex">
                  <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-400 ring-1 ring-white/10">
                    AI-Powered Business Intelligence Platform
                  </div>
                </div>
                <h1 className="text-5xl font-semibold tracking-tight text-pretty text-white sm:text-7xl">
                  Ask Questions. Get Insights. Make Decisions.
                </h1>
                 
          
                  <p className="mt-8 text-lg text-pretty text-white sm:text-xl/8">
                  Transform your business data into actionable insights using natural language. No SQL knowledge required - just ask questions and let our AI deliver the answers you need.
                </p>
                <div className="mt-10 flex items-center gap-x-6">
                  <a
                    href="/signup"
                    className="rounded-md bg-white/10 px-3.5 py-2.5 text-sm font-semibold text-white inset-ring inset-ring-white/5 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Sign Up Free
                  </a>
                  <a href="/login" className="text-sm/6 font-semibold text-white">
                    Login <span aria-hidden="true">→</span>
                  </a>
                </div>
                
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 dark:bg-purple-900">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1483389127117-b6a2102724ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1587&q=80"
            className="aspect-3/2 object-cover lg:aspect-auto lg:size-full"
          />
          
        </div>
      </div>
    </div>
  )
}
