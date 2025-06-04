// backend/src/server.ts

import express from 'express';
import cors from 'cors';           // Cross-Origin Resource Sharing middleware
import dotenv from 'dotenv';       // Environment variable loader
import mongoose from 'mongoose';   // MongoDB object modeling library
import authRoutes from './routes/auth';

// Load environment variables from .env file
// This allows us to store sensitive data like database URLs and secrets outside of code
dotenv.config();

// Create Express application instance
const app = express();
// Set port from environment variable or default to 5000
const PORT = process.env.PORT || 5000;

// MIDDLEWARE SETUP
// Middleware functions execute in order for every request

// CORS middleware - handles Cross-Origin Resource Sharing
// This allows our frontend (running on different port/domain) to make requests to this API
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Allow requests from frontend
  credentials: true  // Allow cookies and authorization headers
}));

// JSON parsing middleware - parses incoming JSON requests
// This populates req.body with parsed JSON data
app.use(express.json());

// ROUTES SETUP

// Health check endpoint - simple endpoint to verify server is running
app.get('/', (req, res) => {
  res.send('Auth API is running with MongoDB!');
});

// Mount authentication routes at /api/auth
// All routes in authRoutes will be prefixed with /api/auth
// Example: POST /api/auth/register, POST /api/auth/login
app.use('/api/auth', authRoutes);

// DATABASE CONNECTION FUNCTION
// Connects to MongoDB using Mongoose ODM
const connectDB = async () => {
  try {
    // Connect to MongoDB using connection string from environment variables
    const conn = await mongoose.connect(process.env.DB_CONNECTION_STRING as string);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1); // Exit process if database connection fails
  }
};

// SERVER STARTUP FUNCTION
// This function starts the server and connects to the database
const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Start Express server listening on specified port
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1); // Exit if server fails to start
  }
};

// Start the server
startServer();