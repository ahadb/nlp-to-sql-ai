import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface LoginFormProps {
  onLogin: (email: string, password: string) => void;
  isLoading?: boolean;
}

const DEMO_USERS = [
  { email: "demo@company.com", password: "demo123", role: "Demo User" },
  { email: "client@company.com", password: "client123", role: "Client" },
  { email: "admin@company.com", password: "admin123", role: "Admin" },
];

export default function LoginForm({
  onLogin,
  isLoading = false,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    // Check if credentials match demo users
    const isValidUser = DEMO_USERS.some(
      (user) => user.email === email && user.password === password
    );

    if (isValidUser) {
      onLogin(email, password);
    } else {
      setError(
        "Invalid credentials. Please use one of the demo accounts below."
      );
    }
  };

  const fillDemoCredentials = (demoUser: (typeof DEMO_USERS)[0]) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError("");
  };

  return (
    <div className="w-full">
      {/* Login Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-400">Sign in to access your SQL AI Assistant</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
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
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
            placeholder="Enter your email"
            disabled={isLoading}
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
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all duration-200 pr-12"
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
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

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      {/* Demo Accounts */}
      <div className="mt-8 p-4 bg-slate-800/30 border border-slate-700/50 rounded-xl">
        <h3 className="text-sm font-semibold text-gray-300 mb-3">
          Demo Accounts
        </h3>
        <div className="space-y-2">
          {DEMO_USERS.map((user, index) => (
            <button
              key={index}
              onClick={() => fillDemoCredentials(user)}
              className="w-full text-left p-2 hover:bg-slate-700/50 rounded-lg transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">{user.role}</p>
                  <p className="text-sm text-white font-medium">{user.email}</p>
                </div>
                <span className="text-xs text-blue-400 group-hover:text-blue-300 transition-colors">
                  Use
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
