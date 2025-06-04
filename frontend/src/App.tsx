// frontend/src/App.tsx

import React from 'react';
// React Router components for client-side routing
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// Authentication context for managing user state across the app
import { AuthProvider, useAuth } from './context/AuthContext';
// Application components
import Dashboard from './components/Dashboard/Dashboard';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import './App.css';

// PROTECTED ROUTE COMPONENT
// This component wraps routes that require authentication
// It checks if user is authenticated before rendering the protected content
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Get authentication state from context
  const { isAuthenticated, loading } = useAuth();
  
  // Show loading spinner while checking authentication status
  // This prevents flashing between logged-in and logged-out states
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }
  
  // If authenticated, render the protected content
  // If not authenticated, redirect to login page
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// MAIN APP COMPONENT
// This is the root component that sets up routing and authentication
function App() {
  return (
    // AuthProvider wraps the entire app to provide authentication context
    // This makes authentication state available to all child components
    <AuthProvider>
      {/* Router enables client-side routing */}
      <Router>
        <div className="App">
          {/* Routes define which component renders for each URL */}
          <Routes>
            {/* Public routes - accessible without authentication */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected route - requires authentication */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Default route - redirect root URL to dashboard */}
            {/* If user is authenticated, they'll see dashboard */}
            {/* If not authenticated, ProtectedRoute will redirect to login */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;