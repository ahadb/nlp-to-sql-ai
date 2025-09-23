import React from 'react';

interface LoadingDotsProps {
  message?: string;
  className?: string;
}

const LoadingDots: React.FC<LoadingDotsProps> = ({ 
  message = "AI is thinking", 
  className = "" 
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
      </div>
      <span className="text-gray-400 text-sm">{message}</span>
    </div>
  );
};

export default LoadingDots;
