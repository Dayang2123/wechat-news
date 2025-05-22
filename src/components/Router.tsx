import React from 'react';
import { useState } from 'react';
import Dashboard from '../pages/Dashboard';
import Articles from '../pages/Articles';
import Categories from '../pages/Categories';
import Editor from '../pages/Editor';
import Export from '../pages/Export';
import Connect from '../pages/Connect';
import Settings from '../pages/Settings';
import { NavigateEvent, NavigationEventDetail } from '../types'; // Import new types

// Simple router component since we're not using react-router in this demo
export const Router: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  
  React.useEffect(() => {
    const handleNavigation = (event: NavigateEvent) => {
      const { page, params } = event.detail;
      let targetPage = page;
      if (params) {
        const queryParams = new URLSearchParams();
        for (const key in params) {
          if (Object.prototype.hasOwnProperty.call(params, key)) {
            const value = params[key];
            queryParams.append(key, String(value));
          }
        }
        if (queryParams.toString()) {
          targetPage += `?${queryParams.toString()}`;
        }
      }
      setCurrentPage(targetPage);
    };
    
    window.addEventListener('navigate', handleNavigation as EventListener);
    
    return () => {
      window.removeEventListener('navigate', handleNavigation as EventListener);
    };
  }, []);
  
  // Updated navigate function to be passed to child components
  const navigate = (pageName: string, params?: Record<string, string | boolean>) => {
    const detail: NavigationEventDetail = { page: pageName, params };
    const event = new CustomEvent('navigate', { detail });
    window.dispatchEvent(event);
  };
  
  // Render the appropriate page based on currentPage state
  // The logic for splitting currentPage to extract base page and params for Editor
  // might need adjustment if params become more complex than just '?new=true'
  // Let's extract the base page name for the switch statement
  const [basePage, queryString] = currentPage.split('?');

  switch (basePage) {
    case 'dashboard':
      return <Dashboard navigate={navigate} />;
    case 'articles':
      // Articles page's navigate prop will now be the new typed one.
      // It will call navigate('editor', { new: 'true' })
      return <Articles navigate={navigate} />; 
    case 'categories':
      return <Categories navigate={navigate} />;
    case 'editor':
      // Editor component now receives the full page string (e.g., 'editor?new=true')
      // This is consistent with its existing prop `page`.
      return <Editor navigate={navigate} page={currentPage} />; 
    case 'export':
      return <Export navigate={navigate} />;
    case 'settings':
      return <Settings navigate={navigate} />;
    case 'connect':
      // Connect page also receives the typed navigate function.
      return <Connect navigate={navigate} />;
    default:
      return <Dashboard navigate={navigate} />;
  }
};