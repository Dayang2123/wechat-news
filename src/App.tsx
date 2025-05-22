import React from 'react';
import { Router } from './components/Router';
import Layout from './components/Layout';
import { AppProvider, useAppContext } from './context/AppContext';
import Connect from './pages/Connect';
import { NavigationEventDetail } from './types'; // Import the new type

function AppContent() {
  const { isConnected } = useAppContext();

  // Define the typed navigate function to be used by Connect page
  const appNavigate = (pageName: string, params?: Record<string, string | boolean>) => {
    const detail: NavigationEventDetail = { page: pageName, params };
    const event = new CustomEvent('navigate', { detail });
    window.dispatchEvent(event);
  };

  if (!isConnected) {
    // Pass the typed appNavigate function to Connect
    return <Connect navigate={appNavigate} />;
  }

  return (
    <Layout>
      <Router />
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;