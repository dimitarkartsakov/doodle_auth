// frontend/src/components/Login/Login.tsx

import React, { useState } from 'react';
// React Router hooks for navigation and linking
import { Link, useNavigate } from 'react-router-dom';
// Authentication context hook
import { useAuth } from '../../context/AuthContext';
import './Login.css';

// LOGIN COMPONENT
// This component handles user authentication through a login form
const Login: React.FC = () => {
  // Hook for programmatic navigation after successful login
  const navigate = useNavigate();
  // Get login function from authentication context
  const { login } = useAuth();
  
  // Local state for form inputs
  // Using single state object for all form fields
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  // State for displaying error messages to user
  const [error, setError] = useState('');
  // State for showing loading indicator during login process
  const [loading, setLoading] = useState(false);

  // FORM SUBMISSION HANDLER
  // Processes login form when user clicks submit
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page refresh)
    e.preventDefault();
    
    // Set loading state and clear any previous errors
    setLoading(true);
    setError('');

    try {
      // Call login function from auth context
      // This makes API request to backend and updates global auth state
      await login(credentials);
      
      // If login successful, navigate to dashboard
      navigate('/dashboard');
    } catch (err: any) {
      // If login fails, display error message to user
      setError(err.message);
    } finally {
      // Always set loading to false when operation completes
      setLoading(false);
    }
  };

  // INPUT CHANGE HANDLER
  // Updates form state when user types in input fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({
      ...credentials, // Spread existing state
      [e.target.name]: e.target.value // Update the specific field that changed
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Login to Doodle Calendar</h2>
        
        {/* Conditional rendering: show error message if it exists */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Login form */}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="email"
              name="email"  // Name matches state property
              placeholder="Email"
              value={credentials.email}  // Controlled input
              onChange={handleChange}    // Update state on change
              required                   // HTML5 validation
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <input
              type="password"
              name="password"  // Name matches state property
              placeholder="Password"
              value={credentials.password}  // Controlled input
              onChange={handleChange}       // Update state on change
              required                      // HTML5 validation
              className="form-input"
            />
          </div>
          
          {/* Submit button with loading state */}
          <button 
            type="submit" 
            disabled={loading}  // Disable button while loading
            className="login-button"
          >
            {/* Show different text based on loading state */}
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        {/* Link to registration page for new users */}
        <p className="login-footer">
          Don't have an account? <Link to="/register" className="login-link">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;