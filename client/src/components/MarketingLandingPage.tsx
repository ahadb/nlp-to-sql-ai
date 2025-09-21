import React from 'react';
import { Link } from 'react-router-dom';
import {
  CircleStackIcon,
  BoltIcon,
  ShieldCheckIcon,
  ChartBarIcon,
  CpuChipIcon,
  GlobeAltIcon,
  CheckIcon,
  ArrowRightIcon,
  ClockIcon,
  UserGroupIcon,
  DocumentTextIcon,
  PlayIcon,
  CloudArrowUpIcon,
  ChatBubbleLeftEllipsisIcon,
} from '@heroicons/react/24/outline';

import Example from './Example';
import Example1 from './Example1';
import Example2 from '../Example2';
import Start from './Start';


const MarketingLandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      {/* <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <CircleStackIcon className="w-8 h-8 text-blue-400 mr-3" />
              <span className="text-xl font-bold text-white">QuantumSQL</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header> */}

      {/* Hero Section */}
      <Example1 />
     

      {/* Social Proof */}

     

      {/* Business Benefits */}
      {/* <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Businesses Choose QuantumSQL
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Stop waiting weeks for data insights. Get answers to your business questions instantly.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500/20 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <ClockIcon className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Save 90% of Time</h3>
              <p className="text-gray-300">
                What used to take hours of SQL writing now takes seconds. Get instant answers to complex business questions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500/20 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <UserGroupIcon className="h-8 w-8 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Empower Your Team</h3>
              <p className="text-gray-300">
                No SQL knowledge required. Marketing, sales, and operations teams can access data independently.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-500/20 w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-6">
                <ChartBarIcon className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Better Decisions</h3>
              <p className="text-gray-300">
                Make data-driven decisions faster. Get insights when you need them, not when IT has time.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* How It Works */}
      <section className="relative isolate overflow-hidden bg-gray-800 py-24 text-center after:pointer-events-none after:absolute after:inset-0 after:inset-ring after:inset-ring-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-300 mb-4">
              AI-Powered 3-Step Workflow
            </h2>
              <p className="text-xl text-gray-300">
                Advanced intelligence transforms your data into business insights in minutes, not weeks
              </p>
            </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-6">
                <CloudArrowUpIcon className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Upload Your Data</h3>
              <p className="text-gray-300">
                Simply upload your CSV files or connect your existing databases. We handle the rest automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-6">
                <ChatBubbleLeftEllipsisIcon className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Ask Questions</h3>
              <p className="text-gray-300">
                Type your business questions in plain English. Our AI understands context and generates perfect insights.
              </p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mx-auto mb-6">
                <ChartBarIcon className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Get Insights</h3>
              <p className="text-gray-300">
                Receive instant answers with exportable reports, charts, and actionable recommendations.
              </p>
            </div>
          </div>
          
          <svg
            viewBox="0 0 1024 1024"
            aria-hidden="true"
            className="absolute top-1/2 left-1/2 -z-10 size-256 -translate-x-1/2 mask-[radial-gradient(closest-side,white,transparent)]"
          >
            <circle r={512} cx={512} cy={512} fill="url(#workflow-gradient)" fillOpacity="0.7" />
            <defs>
              {/* <radialGradient id="workflow-gradient">
                <stop stopColor="#7775D6" />
                <stop offset={1} stopColor="#E935C1" />
              </radialGradient> */}
            </defs>
          </svg>
          </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-300 mb-4">
              Enterprise-Grade Features
            </h2>
            <p className="text-xl text-gray-300">
              Built for business teams who need reliable, secure, and scalable data access
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6">
              <ChatBubbleLeftEllipsisIcon className="h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">AI Chat Assistant</h3>
              <p className="text-gray-300">Ask questions in natural language and get instant insights. Your intelligent data companion understands business context.</p>
            </div>
            
            <div className="p-6">
              <ChartBarIcon className="h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Interactive Dashboards</h3>
              <p className="text-gray-300">Real-time business metrics with sparklines, trend analysis, and key performance indicators at a glance.</p>
            </div>
            
            <div className="p-6">
              <CircleStackIcon className="h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Smart Data Tables</h3>
              <p className="text-gray-300">Browse your data with intelligent filtering, sorting, and search. Handle thousands of records effortlessly.</p>
            </div>
            
            <div className="p-6">
              <DocumentTextIcon className="h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Automated Reports</h3>
              <p className="text-gray-300">Generate professional reports with charts and visualizations. Export to Excel, PDF, or share with your team.</p>
            </div>
            
            <div className="p-6">
              <GlobeAltIcon className="h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Data Connections</h3>
              <p className="text-gray-300">Connect to multiple data sources including CSV uploads, databases, and future integrations with Google Sheets and APIs.</p>
            </div>
            
            <div className="p-6">
              <CpuChipIcon className="h-8 w-8 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Schema Intelligence</h3>
              <p className="text-gray-300">AI automatically understands your data structure, relationships, and creates optimized queries without manual configuration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-blue-300 mb-4">
              What Our Customers Say
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-600/30">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <CheckIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                "QuantumSQL reduced our reporting time from days to minutes. Our sales team can now get customer insights instantly."
              </p>
              <div>
                <p className="font-semibold text-white">Sarah Johnson</p>
                <p className="text-gray-400 text-sm">VP of Sales, TechStart Inc</p>
              </div>
            </div>
            
            <div className="bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-600/30">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <CheckIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                "Finally, our marketing team can analyze campaign data without bothering the IT department. Game changer!"
              </p>
              <div>
                <p className="font-semibold text-white">Mike Chen</p>
                <p className="text-gray-400 text-sm">Marketing Director, Global Solutions</p>
              </div>
            </div>
            
            <div className="bg-gray-700 p-8 rounded-xl shadow-sm border border-gray-600/30">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <CheckIcon key={i} className="h-5 w-5" />
                  ))}
                </div>
              </div>
              <p className="text-gray-300 mb-6">
                "The ROI was immediate. We're making better decisions faster and our team productivity has skyrocketed."
              </p>
              <div>
                <p className="font-semibold text-white">Lisa Rodriguez</p>
                <p className="text-gray-400 text-sm">CEO, Innovation Labs</p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section>
        
      <>
      <Start />
      </>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <span className="text-xl font-bold text-white">DataMind AI</span>
              </div>
              <p className="text-gray-400 max-w-md">
                Transforming business data into actionable insights with AI-powered intelligence. Ask questions in natural language and get instant answers.
              </p>
            </div>
            
            {/* Demo Links */}
            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/login" className="hover:text-white transition-colors duration-200">Login</Link></li>
                <li><Link to="/signup" className="hover:text-white transition-colors duration-200">Sign Up</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 DataMind AI. Demo application.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MarketingLandingPage;