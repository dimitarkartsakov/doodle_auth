// backend/src/routes/auth.ts

import express from 'express';
import bcrypt from 'bcryptjs';      // Library for hashing passwords securely
import jwt from 'jsonwebtoken';     // Library for creating and verifying JSON Web Tokens
import { findUserByEmail, findUserById, createUser } from '../models/User';

const router = express.Router();
// JWT_SECRET is used to sign tokens - should be a strong, random string in production
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development';

// REGISTER ENDPOINT - POST /api/auth/register
// This endpoint creates a new user account
router.post('/register', async (req, res) => {
  try {
    // Extract user data from request body
    const { name, email, password } = req.body;

    // Input validation - ensure all required fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists with this email
    // This prevents duplicate accounts with the same email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password using bcrypt
    // Salt with strength 10 - higher numbers are more secure but slower
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user data object with hashed password
    // NEVER store plain text passwords in the database
    const userData = {
      name,
      email,
      password: hashedPassword,  // Store hashed password, not original
    };

    console.log('Creating user with data:', { name, email, password: 'hashed' });

    // Save user to database using our helper function
    const newUser = await createUser(userData);
    console.log('User saved successfully:', newUser.id);

    // Create JWT token for automatic login after registration
    // Token contains user ID and expires in 1 hour
    const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: '1h' });

    // Send success response with token and user info
    // Don't send password hash back to client
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error: any) {
    console.error('Register error:', error);
    
    // Handle MongoDB duplicate key error (11000 is MongoDB's duplicate key error code)
    if (error?.code === 11000) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Generic server error for any other issues
    res.status(500).json({ message: 'Server error' });
  }
});

// LOGIN ENDPOINT - POST /api/auth/login
// This endpoint authenticates existing users
router.post('/login', async (req, res) => {
  try {
    // Extract login credentials from request body
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find user by email address
    const user = await findUserByEmail(email);
    if (!user) {
      // Don't reveal whether email exists or not - use generic message
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare provided password with stored hash
    // bcrypt.compare handles the hashing and comparison securely
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Same generic message for security
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT token for successful login
    // Token contains user ID and expires in 1 hour
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });

    // Send success response with token and user info
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,  
        email: user.email
      }
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET CURRENT USER ENDPOINT - GET /api/auth/me
// This endpoint returns information about the currently authenticated user
router.get('/me', async (req, res) => {
  try {
    // Extract token from x-auth-token header
    // Frontend sends this header with every authenticated request
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify and decode the JWT token
    // If token is invalid or expired, jwt.verify will throw an error
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // Find user by the ID stored in the token
    const user = await findUserById(decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return user information (without password)
    res.json({
      id: user.id,
      name: user.name,
      email: user.email
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    // If jwt.verify fails, token is invalid
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;