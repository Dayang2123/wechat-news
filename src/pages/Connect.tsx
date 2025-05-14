import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Key, KeyRound } from 'lucide-react';

interface ConnectProps {
  navigate: (page: string) => void;
}

const Connect: React.FC<ConnectProps> = ({ navigate }) => {
  const { connect } = useAppContext();
  const [appId, setAppId] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appId || !appSecret) {
      setError('Please enter both AppID and App Secret');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    // Simulate API connection
    setTimeout(() => {
      try {
        connect(appId, appSecret);
        setIsLoading(false);
        navigate('dashboard');
      } catch (err) {
        setError('Failed to connect. Please check your credentials.');
        setIsLoading(false);
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-[#1A365D] py-6 px-8 text-white">
          <div className="flex items-center space-x-3">
            <BookOpen className="h-8 w-8 text-[#319795]" />
            <h1 className="text-2xl font-bold">WeChat Publisher</h1>
          </div>
          <p className="mt-2 text-[#A0AEC0]">Connect to your WeChat Official Account</p>
        </div>
        
        <form onSubmit={handleConnect} className="p-8">
          {error && (
            <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label htmlFor="appId" className="block text-sm font-medium text-gray-700 mb-1">
              AppID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="appId"
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
                placeholder="Enter your WeChat AppID"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="appSecret" className="block text-sm font-medium text-gray-700 mb-1">
              App Secret
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="appSecret"
                type="password"
                value={appSecret}
                onChange={(e) => setAppSecret(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#319795] focus:border-[#319795]"
                placeholder="Enter your WeChat App Secret"
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#1A365D] hover:bg-[#2D4E6E] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1A365D] transition-colors ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have WeChat API credentials?{' '}
              <a href="#" className="font-medium text-[#319795] hover:text-[#2C7A7B]">
                Learn how to get them
              </a>
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              For demonstration purposes, you can use any values for AppID and App Secret.
              <br />
              In a real application, these would be validated against the WeChat API.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Connect;