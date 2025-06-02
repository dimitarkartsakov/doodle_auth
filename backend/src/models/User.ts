import mongoose, { Schema, Document } from 'mongoose';

// Define the User interface
export interface User {
  name: string;          
  email: string;
  password: string;      // Will store hashed password
}

// Extend the interface for MongoDB document
export interface UserDocument extends User, Document {
  _id: mongoose.Types.ObjectId;
  registrationDate: Date;
}

// Create the MongoDB schema
const UserSchema = new Schema<UserDocument>({
  name: {                
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {            // Will store passwordHash
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  registrationDate: {
    type: Date,
    default: Date.now
  }
}, {
  // Schema options go here (second parameter)
  versionKey: false
});

// Virtual id
UserSchema.virtual('id').get(function (this: any) {
  return this._id.toHexString();
});

// Create the model
export const UserModel = mongoose.model<UserDocument>('User', UserSchema);

// Helper functions
export const findUserByEmail = async (email: string): Promise<UserDocument | null> => {
  try {
    return await UserModel.findOne({ email });
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

export const findUserById = async (id: string): Promise<UserDocument | null> => {
  try {
    return await UserModel.findById(id);
  } catch (error) {
    console.error('Error finding user by id:', error);
    throw error;
  }
};

export const createUser = async (userData: User): Promise<UserDocument> => {
  try {
    const user = new UserModel(userData);
    return await user.save();
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};