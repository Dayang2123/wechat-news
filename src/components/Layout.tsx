import React from 'react';
import Sidebar from './Sidebar';
import { useAppContext } from '../context/AppContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isConnected } = useAppContext();
  
  return (
    <div className="flex h-screen bg-gray-100">
      {isConnected && <Sidebar />}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;