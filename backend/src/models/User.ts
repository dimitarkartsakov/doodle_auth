// backend/src/models/user.ts

import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface - this represents the core user data structure
// This interface defines what properties a user object must have
export interface User {
  name: string;          // User's display name
  email: string;         // User's email address (used for login)
  password: string;      // Will store hashed password (never plain text)
}

// Extend the interface for MongoDB document
// UserDocument combines our User interface with MongoDB's Document interface
// This gives us access to MongoDB-specific properties like _id and methods like save()
export interface UserDocument extends User, Document {
  _id: mongoose.Types.ObjectId;  // MongoDB's unique identifier
  registrationDate: Date;        // When the user account was created
}

// Create the MongoDB schema - this defines the structure and rules for storing users
const UserSchema = new Schema<UserDocument>({
  name: {                
    type: String,
    required: [true, 'Name is required'],  // Validation: name cannot be empty
    trim: true                             // Automatically remove whitespace
  },
  email: {
    type: String,
    required: [true, 'Email is required'], // Validation: email cannot be empty
    unique: true,                          // Database constraint: no duplicate emails
    lowercase: true,                       // Convert to lowercase for consistency
    trim: true                             // Remove whitespace
  },
  password: {            
    type: String,
    required: [true, 'Password is required'], // Validation: password cannot be empty
    minlength: 6                              // Minimum 6 characters
  },
  registrationDate: {
    type: Date,
    default: Date.now                      // Automatically set to current date/time
  }
}, {
  // Schema options - additional configuration for the schema
  versionKey: false                        // Disable MongoDB's __v version field
});

// Virtual property 'id' - creates a virtual field that converts _id to string
// This allows us to use user.id instead of user._id.toString()
UserSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

// Create the Mongoose model - this is what we use to interact with the database
// The model provides methods like find(), save(), delete(), etc.
export const UserModel = mongoose.model<UserDocument>('User', UserSchema);

// Helper functions - these encapsulate common database operations
// This follows the repository pattern, abstracting database operations

// Find a user by their email address
// Returns the user document if found, null if not found
export const findUserByEmail = async (email: string): Promise<UserDocument | null> => {
  try {
    return await UserModel.findOne({ email }); // MongoDB query: find one document with matching email
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error; // Re-throw error so calling code can handle it
  }
};

// Find a user by their MongoDB _id
// Returns the user document if found, null if not found
export const findUserById = async (id: string): Promise<UserDocument | null> => {
  try {
    return await UserModel.findById(id); // MongoDB query: find document by _id
  } catch (error) {
    console.error('Error finding user by id:', error);
    throw error;
  }
};

// Create a new user in the database
// Takes user data, creates a new document, and saves it
export const createUser = async (userData: User): Promise<UserDocument> => {
  try {
    const user = new UserModel(userData); // Create new document instance
    return await user.save();             // Save to database and return the saved document
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};