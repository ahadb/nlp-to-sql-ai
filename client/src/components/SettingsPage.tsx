import { useState } from 'react';
import { 
  CogIcon, 
  BellIcon, 
  ShieldCheckIcon,
  UserCircleIcon,
  CheckIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar, MobileSidebar, TopBar, Layout, AIChatDrawer } from './index';

export default function SettingsPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Settings state
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    queryResults: true,
    systemUpdates: false,
    weeklyReports: true
  });

  const [dataPreferences, setDataPreferences] = useState({
    autoRefresh: true,
    cacheResults: true,
    maxRows: 1000
  });

  const [aiSettings, setAiSettings] = useState({
    responseStyle: 'detailed',
    confidence: 0.8,
    explainQueries: true
  });

  const [privacy, setPrivacy] = useState({
    shareUsageData: false,
    improveAI: true
  });

  const handleSave = () => {
    // In production, save to backend
    console.log('Settings saved:', { notifications, dataPreferences, aiSettings, privacy });
  };

  const settingsContent = (
    <div className="px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Customize your DataMind AI experience</p>
      </div>

        <div className="space-y-8">
          {/* User Profile Section */}
          <div className="border border-gray-700 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Profile</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={user?.full_name || ''}
                  disabled
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Contact support to change your name</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">Contact support to change your email</p>
              </div>
            </div>
          </div>

          {/* AI & Query Settings */}
          <div className="border border-gray-700 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">AI & Query</h2>
              <p className="text-sm text-gray-400 mt-1">Fine-tune AI behavior and query parameters</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Response Style
                </label>
                <select
                  value={aiSettings.responseStyle}
                  onChange={(e) => setAiSettings({...aiSettings, responseStyle: e.target.value})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="concise">Concise</option>
                  <option value="detailed">Detailed</option>
                  <option value="technical">Technical</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">How detailed should AI responses be</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confidence Threshold
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.0"
                  step="0.1"
                  value={aiSettings.confidence}
                  onChange={(e) => setAiSettings({...aiSettings, confidence: parseFloat(e.target.value)})}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Conservative</span>
                  <span>{aiSettings.confidence}</span>
                  <span>Aggressive</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={aiSettings.explainQueries}
                  onChange={(e) => setAiSettings({...aiSettings, explainQueries: e.target.checked})}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-300">Always explain generated SQL queries</span>
              </label>
            </div>
          </div>

          {/* Data Management */}
          <div className="border border-gray-700 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Data Management</h2>
              <p className="text-sm text-gray-400 mt-1">Configure data processing and storage</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Rows per Query
                </label>
                <select
                  value={dataPreferences.maxRows}
                  onChange={(e) => setDataPreferences({...dataPreferences, maxRows: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={100}>100 rows</option>
                  <option value={500}>500 rows</option>
                  <option value={1000}>1,000 rows</option>
                  <option value={5000}>5,000 rows</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Limit results for better performance</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Cache Duration
                </label>
                <select
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1h">1 hour</option>
                  <option value="6h">6 hours</option>
                  <option value="24h">24 hours</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">How long to cache query results</p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={dataPreferences.autoRefresh}
                  onChange={(e) => setDataPreferences({...dataPreferences, autoRefresh: e.target.checked})}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-300">Auto-refresh data sources every 15 minutes</span>
              </label>
              
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={dataPreferences.cacheResults}
                  onChange={(e) => setDataPreferences({...dataPreferences, cacheResults: e.target.checked})}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-300">Cache query results for faster access</span>
              </label>
            </div>
          </div>

          {/* Notifications */}
          <div className="border border-gray-700 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
              <p className="text-sm text-gray-400 mt-1">Manage your notification preferences</p>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300">Email alerts for failed queries</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.emailAlerts}
                  onChange={(e) => setNotifications({...notifications, emailAlerts: e.target.checked})}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300">Notify when query results are ready</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.queryResults}
                  onChange={(e) => setNotifications({...notifications, queryResults: e.target.checked})}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300">System maintenance updates</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.systemUpdates}
                  onChange={(e) => setNotifications({...notifications, systemUpdates: e.target.checked})}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-300">Weekly usage reports</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weeklyReports}
                  onChange={(e) => setNotifications({...notifications, weeklyReports: e.target.checked})}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="border border-gray-700 rounded-lg p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Privacy & Security</h2>
              <p className="text-sm text-gray-400 mt-1">Control your data privacy settings</p>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-300 block">Share anonymous usage data</span>
                  <span className="text-xs text-gray-500">Help us improve DataMind AI with anonymous analytics</span>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.shareUsageData}
                  onChange={(e) => setPrivacy({...privacy, shareUsageData: e.target.checked})}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </label>
              
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-300 block">Contribute to AI improvements</span>
                  <span className="text-xs text-gray-500">Allow queries to help train better AI models (anonymized)</span>
                </div>
                <input
                  type="checkbox"
                  checked={privacy.improveAI}
                  onChange={(e) => setPrivacy({...privacy, improveAI: e.target.checked})}
                  className="w-4 h-4 bg-gray-800 border border-gray-600 rounded focus:ring-2 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Data Export */}
          <div className="border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Data Export</h2>
                <p className="text-sm text-gray-400">Export your data and query history</p>
              </div>
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-white text-sm font-medium transition-colors duration-200"
                disabled
              >
                Export Data
              </button>
            </div>
            
            <div className="border border-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span className="text-sm text-gray-400">Export all your uploaded datasets, query history, and settings as a backup or for migration purposes.</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <CheckIcon className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>
  );

  return (
    <div className="bg-[#1a1a1a] min-h-screen relative">
      <MobileSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <Sidebar />
      <TopBar setSidebarOpen={setSidebarOpen} />
      <Layout
        leftChildren={settingsContent}
        rightChildren={<AIChatDrawer />}
        isDrawerOpen={isDrawerOpen}
        setIsDrawerOpen={setIsDrawerOpen}
        drawerTriggerLabel="Ask AI"
      />
    </div>
  );
}
