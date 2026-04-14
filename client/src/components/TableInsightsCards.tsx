import React from 'react';
import { type TableInsight } from '../data/mockTableInsights';

interface TableInsightsCardsProps {
  insights: TableInsight[];
  patterns: TableInsight[];
  templates: TableInsight[];
  isLoading?: boolean;
  onTemplateClick?: (template: TableInsight) => void;
  onAddNewClick?: () => void;
  tableName?: string;
  hasData?: boolean;
}

const TableInsightsCards: React.FC<TableInsightsCardsProps> = ({
  insights,
  patterns,
  templates,
  isLoading = false,
  onTemplateClick,
  onAddNewClick,
  tableName,
  hasData = true
}) => {
  console.log('🎨 TableInsightsCards render:', { insights, patterns, templates, isLoading, tableName });
  console.log('📋 Templates received:', templates);
  
  // Determine which cards to show based on table type
  const getCardsToShow = () => {
    if (!tableName) return { insights: insights, patterns: patterns, templates: templates };
    
    const lowerName = tableName.toLowerCase();
    
    if (lowerName.includes('billing')) {
      // Billing: Show 2 insights, 2 patterns, 1 template
      return {
        insights: insights.slice(0, 2),
        patterns: patterns.slice(0, 2), 
        templates: templates.slice(0, 1)
      };
    } else if (lowerName.includes('sales')) {
      // Sales: Show 2 insights, 2 patterns, 1 template
      return {
        insights: insights.slice(0, 2),
        patterns: patterns.slice(0, 2),
        templates: templates.slice(0, 1)
      };
    } else if (lowerName.includes('support')) {
      // Support: Show 2 insights, 3 patterns, 1 template
      return {
        insights: insights.slice(0, 2),
        patterns: patterns.slice(0, 3),
        templates: templates.slice(0, 1)
      };
    } else {
      // Default: Show all available cards
      return {
        insights: insights,
        patterns: patterns,
        templates: templates
      };
    }
  };
  
  const cardsToShow = getCardsToShow();

  const getChangeColor = (changeType: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return 'text-green-400 bg-green-400/10';
      case 'negative':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getChangeIcon = (changeType: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return <span className="text-green-400">↗</span>;
      case 'negative':
        return <span className="text-red-400">↘</span>;
      default:
        return <span className="text-gray-400">→</span>;
    }
  };

  const renderCard = (item: TableInsight, type: 'insight' | 'pattern' | 'template') => {
    const isTemplate = type === 'template';
    const cardClass = isTemplate 
      ? 'cursor-pointer hover:bg-gray-800/50 transition-colors' 
      : '';

    return (
      <div
        key={item.id}
        className={`bg-gray-800/30 border rounded-lg p-3 ${isTemplate ? (hasData ? 'border-orange-400' : 'border-gray-600/30') : 'border-gray-600/30'} ${cardClass} ${!hasData ? 'opacity-50' : ''}`}
        onClick={isTemplate && onTemplateClick && hasData ? () => onTemplateClick(item) : undefined}
      >
        {/* Header */}
        <div className="mb-2">
          <h4 className="text-sm font-medium text-gray-400 mb-1">{item.title}</h4>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-lg font-semibold text-white">{hasData ? item.value : '0'}</span>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${hasData ? getChangeColor(item.changeType) : 'bg-gray-500/20 text-gray-500'}`}>
              {hasData ? (
                <span className="flex items-center space-x-1">
                  {getChangeIcon(item.changeType)}
                  <span>{item.change}</span>
                </span>
              ) : '--'}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-xs text-gray-400 line-clamp-2 mb-2 leading-relaxed">
          {hasData ? item.description : 'No data available'}
        </p>
        
        {/* Content based on type */}
        {!isTemplate ? (
          <div>
            <div className="text-xs text-gray-500 text-center">
              {hasData ? (type === 'insight' ? 'AI Insight Analysis' : 'AI Pattern Analysis') : 'Load data to see insights'}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className={`flex items-center space-x-2 text-xs font-medium ${
              hasData ? 'text-orange-400' : 'text-gray-500'
            }`}>
              <div className={`w-4 h-4 rounded flex items-center justify-center ${
                hasData ? 'bg-orange-500/20' : 'bg-gray-500/20'
              }`}>
                <span className={`text-xs font-bold ${
                  hasData ? 'text-orange-400' : 'text-gray-500'
                }`}>AI</span>
              </div>
              <span>{hasData ? 'Run Query' : 'Load data first'}</span>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded mb-2"></div>
              <div className="h-6 bg-gray-700 rounded mb-3"></div>
              <div className="h-3 bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-6 gap-4 text-center">
          <div className="text-xs text-gray-400 font-medium">AI Insights</div>
          <div className="text-xs text-gray-400 font-medium">AI Insights</div>
          <div className="text-xs text-gray-400 font-medium">AI Patterns</div>
          <div className="text-xs text-gray-400 font-medium">AI Patterns</div>
          <div className="text-xs text-gray-400 font-medium">AI Templates</div>
          <div className="text-xs text-gray-400 font-medium">AI Templates</div>
        </div>
      </div>
    );
  }

  // If no data, show a message
  if (cardsToShow.insights.length === 0 && cardsToShow.patterns.length === 0 && cardsToShow.templates.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 text-sm">No AI insights available for this table</div>
        <div className="text-gray-500 text-xs mt-2">Try selecting a different table or check back later</div>
      </div>
    );
  }

  // Calculate total cards to determine grid layout
  const totalCards = cardsToShow.insights.length + cardsToShow.patterns.length + cardsToShow.templates.length + 1; // +1 for Add New
  
  const getGridClass = (totalCards: number) => {
    if (totalCards <= 2) return 'grid-cols-2';
    if (totalCards <= 3) return 'grid-cols-3';
    if (totalCards <= 4) return 'grid-cols-4';
    if (totalCards <= 5) return 'grid-cols-5';
    return 'grid-cols-6';
  };

  return (
    <div className="space-y-4">
      {/* Dynamic Cards Row */}
      <div className={`grid ${getGridClass(totalCards)} gap-4`}>
        {/* AI Insights */}
        {cardsToShow.insights.map((insight) => renderCard(insight, 'insight'))}
        
        {/* AI Patterns */}
        {cardsToShow.patterns.map((pattern) => renderCard(pattern, 'pattern'))}
        
        {/* AI Templates */}
        {cardsToShow.templates.map((template) => renderCard(template, 'template'))}
        
        {/* Add New Card */}
        <div 
          onClick={onAddNewClick}
          className="bg-gray-800/30 border border-gray-600/30 rounded-lg p-4 flex items-center justify-center hover:bg-gray-800/50 transition-colors cursor-pointer group"
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:bg-gray-500/30 transition-colors">
              <span className="text-gray-400 text-2xl font-bold">+</span>
            </div>
            <h4 className="text-sm font-medium text-gray-400 mb-1">Add New</h4>
            <p className="text-xs text-gray-500">Click to add another insight</p>
          </div>
        </div>
      </div>
      
      {/* Dynamic Section Labels */}
      <div className={`grid ${getGridClass(totalCards)} gap-4 text-center`}>
        {cardsToShow.insights.map((_, index) => (
          <div key={`insight-${index}`} className="text-xs text-gray-400 font-medium">AI Insights</div>
        ))}
        {cardsToShow.patterns.map((_, index) => (
          <div key={`pattern-${index}`} className="text-xs text-gray-400 font-medium">AI Patterns</div>
        ))}
        {cardsToShow.templates.map((_, index) => (
          <div key={`template-${index}`} className="text-xs text-gray-400 font-medium">AI Templates</div>
        ))}
        <div className="text-xs text-gray-400 font-medium">Add New</div>
      </div>
    </div>
  );
};

export default TableInsightsCards;

