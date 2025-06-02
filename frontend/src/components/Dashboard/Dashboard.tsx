import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome to Doodle Calendar, {user?.name}!
        </h1>
        <button onClick={logout} className="logout-btn">
          Logout
        </button>
      </header>
      
      <main className="dashboard-content">        
        <section className="dashboard-profile">
          <h2 className="section-title">Your Profile</h2>
          <div className="profile-info">
            <p className="profile-item">
              <span className="profile-label">Name:</span> 
              <span className="profile-value">{user?.name}</span>
            </p>
            <p className="profile-item">
              <span className="profile-label">Email:</span> 
              <span className="profile-value">{user?.email}</span>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;