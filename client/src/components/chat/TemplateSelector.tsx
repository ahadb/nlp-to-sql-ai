import React from 'react';
import { chatTemplates, type ChatTemplate } from '../../data/chatTemplates';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  CreditCardIcon, 
  UserGroupIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface TemplateSelectorProps {
  onSelectTemplate: (template: ChatTemplate) => void;
  isVisible: boolean;
  isLoading?: boolean;
  usedTemplates?: Set<string>;
  showDemoMode?: boolean;
  isDemoModeExpanded?: boolean;
  onToggleDemoMode?: () => void;
  customTemplates?: ChatTemplate[];
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelectTemplate, 
  isVisible, 
  isLoading = false, 
  usedTemplates = new Set(),
  showDemoMode = true,
  isDemoModeExpanded = true,
  onToggleDemoMode,
  customTemplates
}) => {
  if (!isVisible) return null;

  const getIcon = (templateId: string) => {
    switch (templateId) {
      case 'top-customers':
        return UserGroupIcon;
      case 'revenue-trends':
        return ChartBarIcon;
      case 'support-analysis':
        return CurrencyDollarIcon;
      case 'billing-insights':
        return CreditCardIcon;
      case 'customer-segmentation':
        return CurrencyDollarIcon;
      default:
        return ChartBarIcon;
    }
  };

  return (
    <div className="p-4 border-b border-gray-600/30 bg-#202020">
      {showDemoMode && (
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-3">
          <p className="text-sm text-blue-300">
            <strong>Demo Mode:</strong> For this demo, you have access to these templates and 3-5 chat interactions. 
            Click on any template below to see real AI analysis of your data.
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">Quick Analysis Templates</h3>
        {showDemoMode && onToggleDemoMode && (
          <button
            onClick={onToggleDemoMode}
            className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
          >
            {isDemoModeExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      
      {(!showDemoMode || isDemoModeExpanded) && (
        <div className="grid grid-cols-1 gap-2">
        {(customTemplates || chatTemplates).map((template) => {
          const IconComponent = getIcon(template.id);
          const isUsed = usedTemplates.has(template.id);
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              disabled={isLoading || isUsed}
              className={`flex items-start space-x-3 p-3 text-left rounded-lg transition-colors group disabled:cursor-not-allowed ${
                isUsed 
                  ? 'bg-gray-800/20 opacity-50 cursor-not-allowed' 
                  : 'bg-gray-800/30 hover:bg-gray-700/50'
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <IconComponent className="h-4 w-4 text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors">
                    {template.title}
                  </h4>
                  {isUsed && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                      Used
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {template.description}
                </p>
              </div>
            </button>
          );
        })}
        </div>
      )}
    </div>
  );
};

export default TemplateSelector;
