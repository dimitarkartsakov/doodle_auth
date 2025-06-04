// frontend/src/services/authService.ts

import { AuthResponse, LoginCredentials, RegisterCredentials, User } from '../types/auth';

// Base URL for all authentication API endpoints
// In production, this would be your deployed backend URL
const API_BASE_URL = 'http://localhost:5000/api/auth';

// AUTHENTICATION SERVICE OBJECT
// This object contains all functions for communicating with the backend API
// It abstracts HTTP requests and provides a clean interface for authentication operations
export const authService = {
  
  // REGISTER FUNCTION
  // Sends user registration data to backend and returns authentication response
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // Make HTTP POST request to register endpoint
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tell server we're sending JSON
      },
      body: JSON.stringify(credentials), // Convert credentials object to JSON string
    });

    // Check if request was successful
    if (!response.ok) {
      // Parse error message from backend
      const error = await response.json();
      // Throw error with backend message or generic fallback
      throw new Error(error.message || 'Registration failed');
    }

    // Parse and return successful response containing token and user data
    return response.json();
  },

  // LOGIN FUNCTION  
  // Sends login credentials to backend and returns authentication response
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Make HTTP POST request to login endpoint
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Tell server we're sending JSON
      },
      body: JSON.stringify(credentials), // Convert credentials to JSON string
    });

    // Check if request was successful
    if (!response.ok) {
      // Parse error message from backend
      const error = await response.json();
      // Throw error with backend message or generic fallback
      throw new Error(error.message || 'Login failed');
    }

    // Parse and return successful response containing token and user data
    return response.json();
  },

  // GET CURRENT USER FUNCTION
  // Retrieves current user information using stored JWT token
  getCurrentUser: async (): Promise<User> => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If no token exists, user is not logged in
    if (!token) {
      throw new Error('No token found');
    }

    // Make HTTP GET request to /me endpoint with authentication token
    const response = await fetch(`${API_BASE_URL}/me`, {
      headers: {
        'x-auth-token': token, // Send token in custom header for authentication
      },
    });

    // Check if request was successful
    if (!response.ok) {
      // Token is likely invalid or expired
      throw new Error('Failed to get user info');
    }

    // Parse and return user data
    return response.json();
  },

  // LOGOUT FUNCTION
  // Clears authentication token from localStorage
  // Note: This is client-side only - JWT tokens can't be invalidated on server
  logout: () => {
    localStorage.removeItem('token');
  }
};