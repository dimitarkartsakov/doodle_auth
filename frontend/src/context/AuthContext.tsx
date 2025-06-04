// frontend/src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Type definitions for authentication data
import { User, LoginCredentials, RegisterCredentials } from '../types/auth';
// Service for making API calls to backend
import { authService } from '../services/authService';

// Define the shape of the authentication context
// This interface specifies what data and functions the context provides
interface AuthContextType {
  user: User | null;                                      // Currently logged-in user data
  isAuthenticated: boolean;                               // Whether user is logged in
  loading: boolean;                                       // Whether auth state is being loaded
  login: (credentials: LoginCredentials) => Promise<void>; // Function to log in user
  register: (credentials: RegisterCredentials) => Promise<void>; // Function to register user
  logout: () => void;                                     // Function to log out user
}

// Create React context with undefined as initial value
// Context allows sharing state between components without prop drilling
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AUTHENTICATION PROVIDER COMPONENT
// This component manages authentication state for the entire application
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // State for storing current user data
  const [user, setUser] = useState<User | null>(null);
  // State for tracking whether authentication is being initialized
  const [loading, setLoading] = useState(true);

  // Effect runs once when component mounts
  // Checks if user was previously logged in (has valid token)
  useEffect(() => {
    const initAuth = async () => {
      // Check if token exists in localStorage
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // If token exists, verify it with backend and get user data
          const userData = await authService.getCurrentUser();
          setUser(userData); // Set user data if token is valid
        } catch (error) {
          // If token is invalid, remove it from storage
          localStorage.removeItem('token');
        }
      }
      
      // Set loading to false once authentication check is complete
      setLoading(false);
    };

    initAuth();
  }, []); // Empty dependency array means this runs once on mount

  // LOGIN FUNCTION
  // Authenticates user with email and password
  const login = async (credentials: LoginCredentials) => {
    try {
      // Call backend login API
      const response = await authService.login(credentials);
      // Store JWT token in localStorage for persistence
      localStorage.setItem('token', response.token);
      // Update user state with logged-in user data
      setUser(response.user);
    } catch (error) {
      // Re-throw error so components can handle it
      throw error;
    }
  };

  // REGISTER FUNCTION
  // Creates new user account and logs them in
  const register = async (credentials: RegisterCredentials) => {
    try {
      // Call backend register API
      const response = await authService.register(credentials);
      // Store JWT token in localStorage
      localStorage.setItem('token', response.token);
      // Update user state with new user data
      setUser(response.user);
    } catch (error) {
      // Re-throw error so components can handle it
      throw error;
    }
  };

  // LOGOUT FUNCTION
  // Clears user session and redirects to login
  const logout = () => {
    // Remove token from localStorage
    authService.logout();
    // Clear user from state
    setUser(null);
  };

  // Provide authentication state and functions to all child components
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user, // Convert user to boolean (true if user exists)
      loading,
      login,
      register,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// CUSTOM HOOK FOR USING AUTHENTICATION
// This hook provides a convenient way to access authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Ensure hook is used within AuthProvider
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};