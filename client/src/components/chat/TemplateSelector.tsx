import React from 'react';
import { chatTemplates, type ChatTemplate } from '../../data/chatTemplates';
import { 
  ChartBarIcon, 
  CurrencyDollarIcon,
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
  isDemoModeExpanded?: boolean;
  onToggleDemoMode?: () => void;
  customTemplates?: ChatTemplate[];
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelectTemplate, 
  isVisible, 
  isLoading = false, 

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
    <div className="p-3 border-b border-gray-600/30 bg-#202020">
      
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-gray-400">Quick Analysis Templates</h3>
        {onToggleDemoMode && (
          <button
            onClick={onToggleDemoMode}
            className="flex items-center space-x-1 text-gray-400 hover:text-gray-300 transition-colors"
          >
            <span className="text-xs">
              {isDemoModeExpanded ? 'Collapse' : 'Expand'}
            </span>
            {isDemoModeExpanded ? (
              <ChevronUpIcon className="h-3 w-3" />
            ) : (
              <ChevronDownIcon className="h-3 w-3" />
            )}
          </button>
        )}
      </div>
      
      {isDemoModeExpanded && (
        <div className="grid grid-cols-1 gap-1.5">
        {(customTemplates || chatTemplates).map((template) => {
          const IconComponent = getIcon(template.id);
          return (
            <button
              key={template.id}
              onClick={() => onSelectTemplate(template)}
              disabled={isLoading}
              className="flex items-center space-x-2 py-2 px-2.5 text-left rounded-md transition-colors group disabled:cursor-not-allowed bg-gray-800/30 hover:bg-gray-700/50"
            >
              <div className="flex-shrink-0">
                <div className="w-6 h-6 bg-blue-500/20 rounded-md flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                  <IconComponent className="h-3 w-3 text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <h4 className="text-xs font-medium text-white group-hover:text-blue-300 transition-colors">
                    {template.title}
                  </h4>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">
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
