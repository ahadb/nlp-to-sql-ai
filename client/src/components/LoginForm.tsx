import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../contexts/AuthContext";

interface LoginFormProps {
  onLogin?: (email: string, password: string) => void;
  isSignup?: boolean;
  disabled?: boolean;
}

// const DEMO_USERS = [
//   { email: "demo@company.com", password: "demo123", role: "Demo User" },
//   { email: "client@company.com", password: "client123", role: "Client" },
//   { email: "admin@company.com", password: "admin123", role: "Admin" },
// ];

export default function LoginForm({
  onLogin,
  isSignup = false,
  disabled = false,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (!email || !password) {
        setError("Please enter both email and password");
        return;
      }

      if (isSignup && !fullName) {
        setError("Please enter your full name");
        return;
      }

      if (isSignup) {
        await signUp({ email, password, full_name: fullName });
      } else {
        await signIn({ email, password });
      }

      // Call legacy onLogin if provided (for compatibility)
      if (onLogin) {
        onLogin(email, password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error instanceof Error ? error.message : 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  // const fillDemoCredentials = (demoUser: (typeof DEMO_USERS)[0]) => {
  //   setEmail(demoUser.email);
  //   setPassword(demoUser.password);
  //   setError("");
  // };

  return (
    <div className="w-full">


      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* OAuth Section */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Sign in with
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              disabled
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded bg-gray-100 text-gray-400 cursor-not-allowed opacity-60"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#FC6D26" d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 0 1-.3-.94l1.22-3.78 2.44-7.51A.42.42 0 0 1 4.82 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.49h8.1l2.44-7.51A.42.42 0 0 1 18.6 2a.43.43 0 0 1 .58 0 .42.42 0 0 1 .11.18l2.44 7.51L22 13.45a.84.84 0 0 1-.35.94z"/>
              </svg>
              GitLab
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or use email & password</span>
          </div>
        </div>

        {isSignup && (
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-200 rounded-lg"
              placeholder="Enter your full name"
              disabled={isLoading || disabled}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-200 rounded-lg"
            placeholder="Enter your email"
            disabled={isLoading || disabled}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-200 pr-12 rounded-lg"
              placeholder="Enter your password"
              disabled={isLoading || disabled}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || disabled}
          className="w-full border border-blue-500 text-white bg-blue-500/10 hover:bg-blue-500/20 font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (isSignup ? "Creating Account..." : "Signing In...") : (isSignup ? "Create Account" : "Sign In")}
        </button>
      </form>


    </div>
  );
}
