import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoginForm } from "./";
import { useAuth } from "../contexts/AuthContext";

interface AuthPageProps {
  mode: "login" | "signup";
}

export default function AuthPage({ mode }: AuthPageProps) {
  const navigate = useNavigate();
  const [, setMousePosition] = useState({ x: 0, y: 0 });
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/demo");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAuth = async () => {
    // This is now handled by the LoginForm component using useAuth
    // Navigate to demo page after successful authentication
    navigate("/demo");
  };

  // const handleSignup = async (userData: {
  //   firstName: string;
  //   lastName: string;
  //   email: string;
  //   password: string;
  //   confirmPassword: string;
  //   company: string;
  //   region: string;
  // }) => {
  //   setIsLoading(true);

  //   // Simulate API call delay
  //   await new Promise((resolve) => setTimeout(resolve, 1500));

  //   setIsAuthenticated(true);
  //   setIsLoading(false);

  //   // Navigate to app after successful signup
  //   navigate("/app");
  // };

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
          {/* Left Section - Demo Credentials */}
          <div className="w-2/5 flex flex-col justify-center px-8 py-12">
            <div className="w-full max-w-lg">
              {/* Logo and Title */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <h1 className="text-2xl font-bold text-white">
                    DataMind AI
                  </h1>
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Transform your business data into intelligent insights with natural language queries. Ask questions, get answers, make better decisions.
                </p>
              </div>

              {/* Demo Credentials Box */}
              <div className="bg-gray-800/50 border border-gray-600/50 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                 
                  <h2 className="text-lg font-semibold text-white">Demo Credentials</h2>
                </div>
                
                <p className="text-gray-400 text-sm mb-4">
                  Use these credentials to explore the full AI-powered analytics experience
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Email</label>
                    <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2">
                      <code className="text-indigo-300 text-sm">addybokhari@gmail.com</code>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-400 block mb-1">Password</label>
                    <div className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2">
                      <code className="text-indigo-300 text-sm">demo!_user#</code>
                    </div>
                  </div>
                </div>

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

                <LoginForm onLogin={handleAuth} isSignup={mode === "signup"} disabled={mode === "signup"} />

                {/* Signup disabled message */}
                {mode === "signup" && (
                  <div className="mt-4 p-3 bg-orange-500/10 border border-orange-400/30 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <svg className="h-5 w-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <p className="text-orange-400 text-sm">
                        Sign up is currently disabled for demo purposes. Please use the login page to access the demo.
                      </p>
                    </div>
                  </div>
                )}

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
      {/* <style jsx>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style> */}
    </div>
  );
}
