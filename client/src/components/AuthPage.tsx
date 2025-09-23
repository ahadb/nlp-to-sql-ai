import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CircleStackIcon } from "@heroicons/react/24/outline";
import { LoginForm } from "./";
import SignupForm from "./SignupForm";
import { useAuth } from "../contexts/AuthContext";

interface AuthPageProps {
  mode: "login" | "signup";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAuth = async (email: string, password: string) => {
    // This is now handled by the LoginForm component using useAuth
    // Navigate to dashboard after successful authentication
    navigate("/dashboard");
  };

  const handleSignup = async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    company: string;
    region: string;
  }) => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsAuthenticated(true);
    setIsLoading(false);

    // Navigate to app after successful signup
    navigate("/app");
  };

  return (
    <div className="h-screen w-screen bg-gray-900 text-white overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        {/* Keep the nice square background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>
      </div>

      {/* Side-by-Side Layout */}
      <div className="flex h-full w-full relative z-10 justify-center">
        <div className="flex w-full max-w-7xl">
          {/* Left Section - App Description & Features */}
          <div className="w-2/5 flex flex-col justify-center px-8 py-12">
            <div className="w-full max-w-lg">
              {/* Logo and Title */}
              <div className="mb-12">
                <div className="flex items-center mb-8">
                  
                  <h1 className="text-2xl font-bold text-white">
                    DataMind AI
                  </h1>
                </div>
              </div>

              {/* Features Section */}
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Ask questions in natural language
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      No technical knowledge required - simply ask business questions and get instant insights from your data.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Interactive dashboards and reports
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Upload your data and explore it through beautiful dashboards, tables, and automated reports.
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-4 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      AI-powered business intelligence
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      Join business teams who make faster decisions with AI-driven data insights and analytics.
                    </p>
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-12 p-4 border border-blue-500/30 rounded-lg bg-blue-500/10">
                <p className="text-blue-300 text-sm">
                  <span className="font-medium">Pro tip:</span> DataMind AI automatically understands your data structure and relationships, so you can focus on asking the right business questions.
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Authentication Form Card */}
          <div className="w-3/5 flex items-center justify-center px-8 py-12">
            <div className="w-full max-w-md flex justify-center">
              <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 shadow-2xl p-8 w-full rounded-2xl">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {mode === "login" ? "Welcome Back" : "Get Started"}
                  </h2>
                  <p className="text-gray-300">
                    {mode === "login" 
                      ? "Sign in to your account to continue" 
                      : "Create your account to start querying data with AI"
                    }
                  </p>
                </div>

                <LoginForm onLogin={handleAuth} isSignup={mode === "signup"} />

                {/* Toggle between login/signup */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-300">
                    {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                    <button
                      onClick={() => navigate(mode === "login" ? "/signup" : "/login")}
                      className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                    >
                      {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                  </p>
                </div>

                {/* Back to landing page */}
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/")}
                    className="text-sm text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    ← Back to homepage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
}
