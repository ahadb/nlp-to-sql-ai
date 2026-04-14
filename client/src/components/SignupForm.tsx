import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

interface SignupFormProps {
  onSignup: (userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    company: string;
    region: string;
  }) => void;
  isLoading?: boolean;
}

export default function SignupForm({
  onSignup,
  isLoading = false,
}: SignupFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [region, setRegion] = useState("us");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Please fill in all required fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    onSignup({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      company,
      region,
    });
  };

  return (
    <div>
      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Region Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Data region
            <a href="#" className="text-cyan-400 hover:text-cyan-300 text-xs ml-2">(what is this?)</a>
          </label>
          <select 
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white transition-all duration-200 rounded-lg"
          >
            <option value="us">United States</option>
            <option value="eu">European Union</option>
            <option value="asia">Asia Pacific</option>
          </select>
        </div>

        {/* OAuth Section */}
        <div>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled
              className="flex justify-center items-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 transition-colors cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              disabled
              className="flex justify-center items-center px-4 py-2 border border-gray-600 rounded-lg shadow-sm bg-gray-800 text-sm font-medium text-gray-400 hover:bg-gray-700 transition-colors cursor-not-allowed"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.097.118.112.222.082.343-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165C2.69 17.062 1.339 14.116 1.339 10.492c0-3.714 2.7-7.125 7.783-7.125 4.09 0 7.27 2.914 7.27 6.808 0 4.063-2.56 7.334-6.114 7.334-1.194 0-2.315-.624-2.698-1.449 0 0-.59 2.246-.734 2.794-.266 1.043-985 2.298-1.519 3.259C9.574 23.782 10.76 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
              </svg>
              GitHub
            </button>
          </div>
        </div>

        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">Or create account with email</span>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              First Name *
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-200 rounded-lg"
              placeholder="Enter your first name"
              disabled={isLoading}
              required
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Last Name *
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-200 rounded-lg"
              placeholder="Enter your last name"
              disabled={isLoading}
              required
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-200 rounded-lg"
            placeholder="Enter your email"
            disabled={isLoading}
            required
          />
        </div>

        {/* Company Field */}
        <div>
          <label
            htmlFor="company"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Company (Optional)
          </label>
          <input
            id="company"
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-200 rounded-lg"
            placeholder="Enter your company name"
            disabled={isLoading}
          />
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Password *
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-200 pr-12 rounded-lg"
              placeholder="Create a password (min 8 characters)"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Confirm Password *
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-200 pr-12 rounded-lg"
              placeholder="Confirm your password"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Terms and Privacy */}
        <div className="text-sm text-gray-400">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-cyan-400 hover:text-cyan-300 transition-colors">
            Privacy Policy
          </a>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Signup Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full border border-blue-500 text-white bg-blue-500/10 hover:bg-blue-500/20 font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>
    </div>
  );
}
