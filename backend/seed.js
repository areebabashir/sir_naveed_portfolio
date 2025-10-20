import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/authModel.js';
import { hashPassword } from './helpers/authHelper.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Seed user
const seedUser = async () => {
  try {
    await connectDB();
    
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Hash the password
    const hashedPassword = await hashPassword('admin123');
    
    // Create default user
    const defaultUser = new User({
      name: 'Admin User',
      email: 'admin@algoriym.com',
      password: hashedPassword,
      phone: '+1 (555) 123-4567',
      address: '123 Innovation Drive, Tech Valley, CA 94043',
      answer: 'admin'
    });
    
    await defaultUser.save();
    console.log('Successfully seeded default user:');
    console.log(`- Email: ${defaultUser.email}`);
    console.log(`- Password: admin123`);
    console.log(`- Name: ${defaultUser.name}`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding user:', error);
    process.exit(1);
  }
};

// Run the seed function
seedUser();
