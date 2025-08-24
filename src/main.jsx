import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/index.css'; // Make sure your global CSS is imported
import App from './App';
import { AuthProvider } from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);