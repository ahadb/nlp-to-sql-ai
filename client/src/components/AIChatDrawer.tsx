import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon, PaperAirplaneIcon, SparklesIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { api, type ChatResponse } from '../services/api';
import ChatMessage from './chat/ChatMessage';
import TemplateSelector from './chat/TemplateSelector';
import AILoadingMessage from './chat/AILoadingMessage';
import { type ChatTemplate } from '../data/chatTemplates';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTemplate?: string | null;
  customTemplates?: ChatTemplate[];
  activeTableName?: string | null;
  hasData?: boolean;
}

interface ChatHistoryItem {
  id: string;
  message: string;
  response: ChatResponse;
  timestamp: string;
  isUser: boolean;
}

const AIChatDrawer: React.FC<AIChatDrawerProps> = ({ isOpen, onClose, initialTemplate, customTemplates, activeTableName, hasData = true }) => {
  // Convert table templates to ChatTemplate format
  const convertedTemplates: ChatTemplate[] | undefined = customTemplates ? customTemplates.map((template, index) => ({
    id: `table-template-${index}`,
    title: template.title,
    description: template.description,
    message: `Analyze ${template.title.toLowerCase()} in the current table`
  })) : undefined;
  
  console.log('🎯 AIChatDrawer - customTemplates:', customTemplates);
  console.log('🎯 AIChatDrawer - convertedTemplates:', convertedTemplates);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [showTemplates, setShowTemplates] = useState(true);
  const [usedTemplates, setUsedTemplates] = useState<Set<string>>(new Set());
  const [showDemoMode, setShowDemoMode] = useState(true);
  const [isDemoModeExpanded, setIsDemoModeExpanded] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const demoModeHiddenRef = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Handle initial template when drawer opens
  useEffect(() => {
    if (isOpen && initialTemplate) {
      // Set the message and send it automatically
      setMessage(initialTemplate);
      // Auto-send the template message
      setTimeout(() => {
        handleSendMessage();
      }, 100);
    }
  }, [isOpen, initialTemplate]);

  // Demo mode is now hidden manually on first template click

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');
    setIsLoading(true);

    // Add user message to history
    const userMessageItem: ChatHistoryItem = {
      id: Date.now().toString(),
      message: userMessage,
      response: {} as ChatResponse,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    setChatHistory(prev => [...prev, userMessageItem]);

    try {
      const schemaId = activeTableName || "all";
      const response = await api.sendChatMessage(userMessage, schemaId);
      
      // Add AI response to history
      const aiResponseItem: ChatHistoryItem = {
        id: (Date.now() + 1).toString(),
        message: userMessage,
        response,
        timestamp: response.timestamp,
        isUser: false
      };

      setChatHistory(prev => [...prev, aiResponseItem]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to history
      const errorResponseItem: ChatHistoryItem = {
        id: (Date.now() + 1).toString(),
        message: userMessage,
        response: {
          status: 'error',
          message: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date().toISOString()
        } as ChatResponse,
        timestamp: new Date().toISOString(),
        isUser: false
      };

      setChatHistory(prev => [...prev, errorResponseItem]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTemplateSelect = async (template: ChatTemplate) => {
    // Mark template as used
    setUsedTemplates(prev => new Set([...prev, template.id]));
    
    // Hide demo panel after first template click (only once)
    if (!demoModeHiddenRef.current) {
      demoModeHiddenRef.current = true;
      setShowDemoMode(false);
    }
    
    // Add user message
    const userMessageItem: ChatHistoryItem = {
      id: Date.now().toString(),
      message: template.message,
      response: {} as ChatResponse,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    setChatHistory(prev => [...prev, userMessageItem]);
    setIsLoading(true);

    try {
      // Make real API call
      const schemaId = activeTableName || "all";
      const response = await api.sendChatMessage(template.message, schemaId);
      
      // Add AI response
      const aiResponseItem: ChatHistoryItem = {
        id: (Date.now() + 1).toString(),
        message: template.message,
        response,
        timestamp: response.timestamp,
        isUser: false
      };

      setChatHistory(prev => [...prev, aiResponseItem]);
    } catch (error) {
      console.error('Error sending template message:', error);
      // Add error message to history
      const errorResponseItem: ChatHistoryItem = {
        id: (Date.now() + 1).toString(),
        message: template.message,
        response: {
          status: 'error',
          message: 'Sorry, I encountered an error processing your request. Please try again.',
          timestamp: new Date().toISOString()
        } as ChatResponse,
        timestamp: new Date().toISOString(),
        isUser: false
      };

      setChatHistory(prev => [...prev, errorResponseItem]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-[#1a1a1a] border-l border-gray-600/30 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50 bg-[#262626]">
          <div>
            <h2 className="text-xl font-semibold text-white">AI Assistant</h2>
            <p className="text-sm text-gray-400">Choose a template or ask questions about your data</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>


        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!hasData ? (
            <div className="text-center py-8 bg-[#282828] rounded-lg mx-2">
              <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
              <h3 className="text-white font-medium mb-2">Load Data First</h3>
              <p className="text-gray-400 text-sm mb-4">
                Please load your data first to unlock AI features. Once you have data loaded, I can help you:
              </p>
              <div className="text-left text-sm text-gray-400 space-y-1">
                <div>• Generate SQL queries from natural language</div>
                <div>• Analyze your business data</div>
                <div>• Provide insights and recommendations</div>
                <div>• Answer questions about your data</div>
              </div>
            </div>
          ) : chatHistory.length === 0 && !showTemplates ? (
            <div className="text-center py-8 bg-[#282828] rounded-lg mx-2">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">AI</span>
              </div>
              <h3 className="text-white font-medium mb-2">Welcome to AI Assistant</h3>
              <p className="text-gray-400 text-sm mb-4">
                Ask me anything about your data. I can help you:
              </p>
              <div className="text-left text-sm text-gray-400 space-y-1">
                <div>• Generate SQL queries from natural language</div>
                <div>• Analyze your business data</div>
                <div>• Provide insights and recommendations</div>
                <div>• Answer questions about your data</div>
              </div>
            </div>
          ) : (
            chatHistory.map((item) => (
              <ChatMessage
                key={item.id}
                message={item.message}
                response={item.response}
                isUser={item.isUser}
                timestamp={item.timestamp}
              />
            ))
          )}
          
          {isLoading && (
            <div className="flex justify-start">
              <AILoadingMessage />
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Templates - Moved to bottom */}
        <div className="px-4 py-3 border-t border-gray-700/50 bg-[#2a2a2a]">
          <TemplateSelector 
            key={`template-selector-${showDemoMode}`}
            onSelectTemplate={handleTemplateSelect}
            isVisible={true}
            isLoading={isLoading}
            usedTemplates={usedTemplates}
            showDemoMode={showDemoMode}
            isDemoModeExpanded={isDemoModeExpanded}
            onToggleDemoMode={() => setIsDemoModeExpanded(!isDemoModeExpanded)}
            customTemplates={convertedTemplates}
          />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-600/30">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Demo mode - try the templates above to see AI in action"
              className="flex-1 px-4 py-2 bg-gray-800/30 border border-gray-600/30 rounded-lg text-gray-500 placeholder-gray-500 cursor-not-allowed opacity-50"
              disabled={true}
            />
            <button
              onClick={handleSendMessage}
              disabled={true}
              className="px-4 py-2 bg-gray-600 text-gray-400 rounded-lg cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <PaperAirplaneIcon className="h-4 w-4" />
              <span>Demo Mode</span>
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">
            In demo mode, try the templates above to experience AI-powered data analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChatDrawer;