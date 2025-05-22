import React from 'react';
import { useAppContext } from '../context/AppContext';
import { AIProvider } from '../types'; // Ensure AIProvider type is imported

interface SettingsProps {
  navigate: (page: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ navigate }) => {
  const { aiProviders, updateAIProvider } = useAppContext();

  const handleApiKeyChange = (providerName: string, apiKey: string) => {
    const providerToUpdate = aiProviders.find(p => p.name === providerName);
    if (providerToUpdate) {
      updateAIProvider({ ...providerToUpdate, apiKey });
    }
  };

  const handleEnabledChange = (providerName: string, enabled: boolean) => {
    const providerToUpdate = aiProviders.find(p => p.name === providerName);
    if (providerToUpdate) {
      updateAIProvider({ ...providerToUpdate, enabled });
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">AI Provider Settings</h1>
        <button
          onClick={() => navigate('dashboard')}
          className="px-4 py-2 bg-[#1A365D] text-white rounded-lg hover:bg-[#2D4E6E] transition-colors"
        >
          Back to Dashboard
        </button>
      </div>

      <div className="space-y-8">
        {aiProviders.map((provider: AIProvider) => (
          <div key={provider.name} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">{provider.name}</h3>
            
            <div className="mb-4">
              <label htmlFor={`${provider.name}-apikey`} className="block text-sm font-medium text-gray-600 mb-1">
                API Key
              </label>
              <input
                type="password" // Use password type to obscure API key
                id={`${provider.name}-apikey`}
                placeholder="Enter API Key"
                value={provider.apiKey}
                onChange={(e) => handleApiKeyChange(provider.name, e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#319795] focus:border-[#319795] sm:text-sm"
              />
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`${provider.name}-enabled`}
                checked={provider.enabled}
                onChange={(e) => handleEnabledChange(provider.name, e.target.checked)}
                className="h-4 w-4 text-[#319795] focus:ring-[#2c7a7b] border-gray-300 rounded"
              />
              <label htmlFor={`${provider.name}-enabled`} className="ml-2 block text-sm text-gray-700">
                Enable {provider.name}
              </label>
            </div>
          </div>
        ))}
      </div>
      {aiProviders.length === 0 && (
        <p className="text-gray-500">No AI providers configured yet.</p>
      )}
    </div>
  );
};

export default Settings;
