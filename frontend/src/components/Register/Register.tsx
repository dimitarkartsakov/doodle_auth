// frontend/src/components/Register/Register.tsx

import React, { useState } from 'react';
// React Router hooks for navigation and linking
import { Link, useNavigate } from 'react-router-dom';
// Authentication context hook
import { useAuth } from '../../context/AuthContext';
import './Register.css';

// REGISTER COMPONENT
// This component handles new user registration through a signup form
const Register: React.FC = () => {
  // Hook for programmatic navigation after successful registration
  const navigate = useNavigate();
  // Get register function from authentication context
  const { register } = useAuth();
  
  // Local state for form inputs
  // Registration requires name, email, and password
  const [credentials, setCredentials] = useState({
    name: '',    // User's full name
    email: '',   // User's email address
    password: '' // User's chosen password
  });
  
  // State for displaying error messages to user
  const [error, setError] = useState('');
  // State for showing loading indicator during registration process
  const [loading, setLoading] = useState(false);

  // FORM SUBMISSION HANDLER
  // Processes registration form when user clicks submit
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent default form submission behavior (page refresh)
    e.preventDefault();
    
    // Set loading state and clear any previous errors
    setLoading(true);
    setError('');

    try {
      // Call register function from auth context
      // This makes API request to backend, creates account, and logs user in
      await register(credentials);
      
      // If registration successful, navigate to dashboard
      // User is automatically logged in after successful registration
      navigate('/dashboard');
    } catch (err: any) {
      // If registration fails, display error message to user
      // Common errors: email already exists, weak password, etc.
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
      ...credentials, // Spread existing state to preserve other fields
      [e.target.name]: e.target.value // Update the specific field that changed
    });
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-title">Join Doodle Calendar</h2>
        
        {/* Conditional rendering: show error message if it exists */}
        {error && <div className="error-message">{error}</div>}
        
        {/* Registration form */}
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <input
              type="text"
              name="name"  // Name matches state property
              placeholder="Full Name"
              value={credentials.name}  // Controlled input
              onChange={handleChange}   // Update state on change
              required                  // HTML5 validation
              className="form-input"
            />
          </div>
          
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
            className="register-button"
          >
            {/* Show different text based on loading state */}
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>
        
        {/* Link to login page for existing users */}
        <p className="register-footer">
          Already have an account? <Link to="/login" className="register-link">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;