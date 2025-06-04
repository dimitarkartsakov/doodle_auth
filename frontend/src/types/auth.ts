// frontend/src/types/auth.ts

// TYPE DEFINITIONS FOR AUTHENTICATION
// These interfaces define the shape of data used throughout the authentication system
// TypeScript uses these to provide type safety and better development experience

// USER INTERFACE
// Represents a user object as returned by the backend API
// This is the core user data structure used throughout the frontend
export interface User {
  id: string;       // Unique identifier from MongoDB
  name: string;     // User's display name
  email: string;    // User's email address
}

// AUTHENTICATION RESPONSE INTERFACE
// Represents the response structure from login and register API endpoints
// Both endpoints return this same format when successful
export interface AuthResponse {
  message: string;  // Success message from backend (e.g., "Login successful")
  token: string;    // JWT token for authentication
  user: User;       // User object containing id, name, and email
}

// LOGIN CREDENTIALS INTERFACE
// Represents the data needed to authenticate an existing user
// Used by login form and login API call
export interface LoginCredentials {
  email: string;    // User's email address
  password: string; // User's password (sent as plain text, hashed on backend)
}

// REGISTER CREDENTIALS INTERFACE
// Represents the data needed to create a new user account
// Used by registration form and register API call
export interface RegisterCredentials {
  name: string;     // User's full name
  email: string;    // User's email address
  password: string; // User's chosen password (sent as plain text, hashed on backend)
}

// NOTES:
// - These interfaces ensure type safety across the application
// - They match the data structures expected by the backend API
// - Password is sent as plain text but immediately hashed on the backend
// - The User interface excludes sensitive data like password hashes
// - All interfaces use string types for simplicity and JSON compatibility