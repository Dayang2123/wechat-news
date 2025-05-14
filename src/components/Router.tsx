import React from 'react';
import { useState } from 'react';
import Dashboard from '../pages/Dashboard';
import Articles from '../pages/Articles';
import Categories from '../pages/Categories';
import Editor from '../pages/Editor';
import Export from '../pages/Export';
import Connect from '../pages/Connect';

// Simple router component since we're not using react-router in this demo
export const Router: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  
  // This is a custom event listener to change pages from anywhere in the app
  React.useEffect(() => {
    const handleNavigation = (e: CustomEvent) => {
      setCurrentPage(e.detail.page);
    };
    
    window.addEventListener('navigate' as any, handleNavigation);
    
    return () => {
      window.removeEventListener('navigate' as any, handleNavigation);
    };
  }, []);
  
  // Simple navigation function that can be exported and used elsewhere
  const navigate = (page: string) => {
    const event = new CustomEvent('navigate', { detail: { page } });
    window.dispatchEvent(event);
  };
  
  // Render the appropriate page based on currentPage state
  switch (currentPage) {
    case 'dashboard':
      return <Dashboard navigate={navigate} />;
    case 'articles':
      return <Articles navigate={navigate} />;
    case 'categories':
      return <Categories navigate={navigate} />;
    case 'editor':
      return <Editor navigate={navigate} />;
    case 'export':
      return <Export navigate={navigate} />;
    case 'connect':
      return <Connect navigate={navigate} />;
    default:
      return <Dashboard navigate={navigate} />;
  }
};