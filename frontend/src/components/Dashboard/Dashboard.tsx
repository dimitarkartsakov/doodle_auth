// frontend/src/components/Dashboard/Dashboard.tsx

import React from 'react';
// React Router hook for navigation
import { useNavigate } from 'react-router-dom';
// Authentication context hook
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

// DASHBOARD COMPONENT
// This is the main application interface shown to authenticated users
// Currently displays user profile information and provides logout functionality
const Dashboard: React.FC = () => {
  // Hook for programmatic navigation (currently unused but available)
  const navigate = useNavigate();
  // Get user data and logout function from authentication context
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      {/* Header section with title and logout button */}
      <header className="dashboard-header">
        {/* Personalized welcome message using user's name */}
        <h1 className="dashboard-title">
          Welcome to Doodle Calendar, {user?.name}!
        </h1>
        
        {/* Logout button - calls logout function from auth context */}
        {/* This will clear user state and redirect to login page */}
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>
      
      {/* Main content area */}
      <main className="dashboard-content">        
        {/* User profile section */}
        <section className="dashboard-profile">
          <h2 className="section-title">Your Profile</h2>
          
          {/* Display user information from auth context */}
          <div className="profile-info">
            <p className="profile-item">
              <span className="profile-label">Name:</span> 
              {/* Use optional chaining in case user is null */}
              <span className="profile-value">{user?.name}</span>
            </p>
            <p className="profile-item">
              <span className="profile-label">Email:</span> 
              {/* Use optional chaining in case user is null */}
              <span className="profile-value">{user?.email}</span>
            </p>
          </div>
        </section>
        
        {/* Future sections for calendar functionality would go here */}
        {/* For example: */}
        {/* - Recent doodle polls */}
        {/* - Upcoming events */}
        {/* - Create new poll button */}
      </main>
    </div>
  );
};

export default Dashboard;