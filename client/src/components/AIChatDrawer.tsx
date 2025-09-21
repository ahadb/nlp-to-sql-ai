
import React, { useState, useRef, useEffect } from 'react';
import {
  PaperAirplaneIcon,
  SparklesIcon,
  UserIcon,
  CodeBracketIcon,
  ClipboardDocumentIcon,
} from '@heroicons/react/24/outline';


interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  sqlQuery?: string;
}

const AIChatDrawer: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hello! I can help you turn your questions into SQL queries. Try asking something like "Show me top customers by revenue" or "What are our sales trends this month?"',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Here\'s the SQL query for your request:',
        timestamp: new Date(),
        sqlQuery: `SELECT 
    customer_name,
    SUM(order_value) as total_revenue,
    COUNT(*) as order_count
FROM customers c
JOIN orders o ON c.id = o.customer_id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY customer_name
ORDER BY total_revenue DESC
LIMIT 10;`
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-blue-600' 
                    : 'bg-gray-700/50'
                }`}>
                  {message.type === 'user' ? (
                    <UserIcon className="h-4 w-4 text-white" />
                  ) : (
                    <SparklesIcon className="h-4 w-4 text-blue-400" />
                  )}
                </div>
                <div className={`rounded-xl p-4 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#262626] text-gray-100'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {message.sqlQuery && (
                    <div className="mt-3 bg-gray-900 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
                        <div className="flex items-center space-x-2">
                          <CodeBracketIcon className="h-4 w-4 text-gray-400" />
                          <span className="text-xs font-medium text-gray-400">SQL Query</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(message.sqlQuery!)}
                          className="flex items-center space-x-1 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors duration-200"
                        >
                          <ClipboardDocumentIcon className="h-3 w-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <div className="p-3">
                        <CodeHighlighter code={message.sqlQuery} language="sql" />
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="flex items-center justify-center w-8 h-8 bg-gray-700/50 rounded-lg">
                <SparklesIcon className="h-4 w-4 text-blue-400 animate-pulse" />
              </div>
              <div className="bg-[#262626] rounded-xl p-4">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-400">Generating SQL...</span>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-700/50 bg-[#262626]">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your data..."
              className="w-full bg-[#1a1a1a] border border-gray-600/50 rounded-lg px-4 py-3 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200"
              rows={2}
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">Press Enter to send, Shift+Enter for new line</p>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white p-3 rounded-lg transition-colors duration-200 flex-shrink-0"
          >
            <PaperAirplaneIcon className="h-4 w-4" />
          </button>
        </div>

        {/* Quick Suggestions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            "Show top customers by revenue",
            "What are our sales trends?",
            "List recent orders",
            "Customer growth this month"
          ].map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setInputValue(suggestion)}
              className="px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 hover:text-white text-xs rounded-md transition-colors duration-200"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIChatDrawer;
