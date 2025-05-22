import React from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Edit3, 
  Download, 
  Settings, 
  LogOut,
  BookOpen
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { NavigationEventDetail } from '../types'; // Import the new type

const Sidebar: React.FC = () => {
  const { disconnect } = useAppContext();
  // Updated navigate function to use the new typed event
  const navigate = (pageName: string, params?: Record<string, string | boolean>) => {
    const detail: NavigationEventDetail = { page: pageName, params };
    const event = new CustomEvent('navigate', { detail });
    window.dispatchEvent(event);
  };

  return (
    <div className="w-64 bg-[#1A365D] text-white p-4 flex flex-col h-full">
      <div className="flex items-center mb-10 mt-2">
        <BookOpen className="h-8 w-8 mr-2 text-[#319795]" />
        <h1 className="text-xl font-bold">WeChat Publisher</h1>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => navigate('dashboard')}
              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-[#2D4E6E] transition-colors"
            >
              <LayoutDashboard className="h-5 w-5 mr-3" />
              <span>Dashboard</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('articles')}
              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-[#2D4E6E] transition-colors"
            >
              <FileText className="h-5 w-5 mr-3" />
              <span>Articles</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('categories')}
              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-[#2D4E6E] transition-colors"
            >
              <FolderOpen className="h-5 w-5 mr-3" />
              <span>Categories</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('editor')}
              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-[#2D4E6E] transition-colors"
            >
              <Edit3 className="h-5 w-5 mr-3" />
              <span>Editor</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => navigate('export')}
              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-[#2D4E6E] transition-colors"
            >
              <Download className="h-5 w-5 mr-3" />
              <span>Export</span>
            </button>
          </li>
        </ul>
      </nav>
      
      <div className="pt-4 mt-6 border-t border-[#2D4E6E]">
        <ul className="space-y-2">
          <li>
            <button 
              onClick={() => navigate('settings')}
              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-[#2D4E6E] transition-colors"
            >
              <Settings className="h-5 w-5 mr-3" />
              <span>Settings</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => {
                disconnect();
                navigate('connect');
              }}
              className="w-full flex items-center px-4 py-3 rounded-lg hover:bg-[#2D4E6E] transition-colors text-red-300"
            >
              <LogOut className="h-5 w-5 mr-3" />
              <span>Disconnect</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;