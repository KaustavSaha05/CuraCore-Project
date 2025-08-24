// src/App.jsx

import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth.js';

// Import all your page components
import HomePage from './pages/HomePage.jsx';
import BasicHealthPage from './pages/BasicHealthPage.jsx';
import ReportAnalyzerPage from './pages/ReportAnalyzerPage.jsx';
import ChatbotPage from './pages/ChatbotPage.jsx';
import FindingFacilitiesPage from './pages/FindingFacilitiesPage.jsx';
import { Login } from './components/auth/Login.jsx';
import { Signup } from './components/auth/Signup.jsx';

function App() {
  const { currentUser } = useAuth();
  const [showLoginPage, setShowLoginPage] = useState(true);
  const [currentPage, setCurrentPage] = useState('home');

  const toggleAuthPage = () => {
    setShowLoginPage(!showLoginPage);
  };

  // This function will render the correct page based on the currentPage state
  const renderPage = () => {
    // We now pass onNavigate to every page so they can return to the homepage
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'basicHealth':
        return <BasicHealthPage onNavigate={setCurrentPage} />;
      case 'reportAnalyzer':
        return <ReportAnalyzerPage onNavigate={setCurrentPage} />;
      case 'chatbot':
        return <ChatbotPage onNavigate={setCurrentPage} />;
      case 'findFacilities':
        return <FindFacilitiesPage onNavigate={setCurrentPage} />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="App">
      {currentUser ? (
        renderPage()
      ) : (
        showLoginPage ? (
          <Login onTogglePage={toggleAuthPage} />
        ) : (
          <Signup onTogglePage={toggleAuthPage} />
        )
      )}
    </div>
  );
}

export default App;