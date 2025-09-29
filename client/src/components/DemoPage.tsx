import React from "react";
import { useNavigate } from "react-router-dom";
import TopBar from "./TopBar";
import { 
  ArrowRightIcon, 
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  CodeBracketIcon,
  ChartBarIcon,
  ServerStackIcon,
  CpuChipIcon,
} from "@heroicons/react/24/outline";

const DemoPage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#1a1a1a] min-h-screen">
      <TopBar setSidebarOpen={() => {}}/>
      
      {/* Main Content */}
      <main className="pt-16">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="pt-12 px-6 pb-6 border-b border-gray-700/50">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                <h1 className="text-4xl font-bold text-white text-left mb-4">DataMind Controlled Demo</h1>
                <p className="text-gray-400 text-left text-lg leading-relaxed">Welcome to DataMind AI! We truly respect your time, so we've prepared a curated demonstration of our powerful AI capabilities. This is a production-grade data analytics and business intelligence application with full backend, frontend, cloud infrastructure, and modern web app architecture - you get all that enterprise-grade infrastructure included.</p>
                <br />
                <p className="text-gray-400 text-left text-lg leading-relaxed">We're focusing this demo on the AI technology that makes the difference. You'll explore carefully crafted questions that showcase AI-powered data analysis, real-time insights generation, and intelligent recommendations - exactly the types of queries your team would use in a real implementation.</p>
                </div>
                <div className="ml-8">
                  <button
                    onClick={() => {
                      // Navigate to dashboard
                      navigate('/dashboard');
                    }}
                    className="inline-flex items-center px-10 py-5 border border-indigo-400 text-indigo-400 font-semibold rounded-lg hover:border-indigo-300 hover:text-indigo-300 hover:bg-indigo-500/10 transition-all duration-200 whitespace-nowrap"
                  >
                    Continue to Dashboard
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-6xl mx-auto py-8">
              {/* Stats Cards - Same as Dashboard */}
              {/* <DashboardCards /> */}
              
              {/* Demo Content */}
              <div className="mt-6 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-left">AI Features You'll Explore</h2>
                <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                  Sample documents will be pre-loaded for you in the dashboard. The only AI-enabled pages are Dashboard and Data Tables, so focus on them. Try the AI chat drawer, 
                  explore our quick templates, and experience real LLM-generated responses to natural language queries. This demo uses live CSV files - 
                  in the full version, you'll connect your own databases and integrate with your existing data sources.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <ChartBarIcon className="h-5 w-5 text-purple-400 mr-3" />
                      Dashboard AI Insights
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      View real LLM-generated insights and patterns on the Dashboard page. Customize for your specific data types and business logic.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <ServerStackIcon className="h-5 w-5 text-blue-400 mr-3" />
                      Data Tables AI Analysis
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Explore real LLM-powered analysis for specific data tables. Each table gets tailored AI-generated insights and recommendations.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-400 mr-3" />
                      AI Chat Drawer
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Ask questions in plain English through the AI chat. Get real LLM responses and auto-generated SQL queries.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <SparklesIcon className="h-5 w-5 text-orange-400 mr-3" />
                      Smart Templates
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Use pre-built templates that trigger real LLM responses. Customize templates for your industry and use cases.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <CpuChipIcon className="h-5 w-5 text-cyan-400 mr-3" />
                      Natural Language Queries
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Ask complex questions in plain English. Get real LLM responses that understand context and generate appropriate answers.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                      <CodeBracketIcon className="h-5 w-5 text-pink-400 mr-3" />
                      Auto SQL Generation
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      Convert natural language to SQL automatically using real LLM processing. Configure for your database schema and security requirements.
                    </p>
                  </div>
                </div>
              </div>

              {/* Roadmap Section */}
              <div className="mt-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6 text-left">Product Roadmap</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Phase 1 - Current Demo */}
                  <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white">Phase 1: AI Demo</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">What you're experiencing now</p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Real LLM AI responses</li>
                      <li>• Natural language queries</li>
                      <li>• Auto SQL generation</li>
                      <li>• Interactive dashboards</li>
                    </ul>
                  </div>

                  {/* Phase 2 - Production Ready */}
                  <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white">Phase 2: Production</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">When you implement</p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Connect your own data sources</li>
                      <li>• AI enabled on any tab you want</li>
                      <li>• Data source integrations (APIs, databases)</li>
                      <li>• Advanced data visualization</li>
                    </ul>
                  </div>

                  {/* Phase 3 - Future Vision */}
                  <div className="bg-[#1a1a1a] border border-gray-600/30 rounded-lg p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-white">Phase 3: Enterprise</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Future vision</p>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li>• Multi-database connections</li>
                      <li>• Team collaboration features</li>
                      <li>• Custom workflows</li>
                      <li>• Advanced analytics</li>
                    </ul>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DemoPage;
