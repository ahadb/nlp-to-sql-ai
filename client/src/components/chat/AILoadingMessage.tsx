import React, { useState, useEffect } from 'react';
import LoadingDots from './LoadingDots';

interface AILoadingMessageProps {
  className?: string;
}

const AILoadingMessage: React.FC<AILoadingMessageProps> = ({ className = "" }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Analyzing your request",
    "Generating SQL query", 
    "Executing database query",
    "Processing results",
    "Generating insights"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2000); // Change step every 2 seconds

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className={`bg-[#1a1a1a] border border-gray-600/30 rounded-lg p-4 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-bold">AI</span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <LoadingDots message={steps[currentStep]} />
          </div>
          <div className="flex items-center space-x-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                  index <= currentStep ? 'bg-blue-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILoadingMessage;
