import React from 'react';
import { Router } from './components/Router';
import Layout from './components/Layout';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Layout>
        <Router />
      </Layout>
    </AppProvider>
  );
}

export default App;