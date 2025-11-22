import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/foodies';
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);

    const user = await User.findOne({ email: 'admin@foodies.com' });
    
    if (user) {
      console.log('Admin User Found:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
      
      if (user.role !== 'admin') {
        console.log('Updating user role to admin...');
        user.role = 'admin';
        await user.save();
        console.log('User role updated to admin');
      }
    } else {
      console.log('Admin user not found. Creating one...');
      const newUser = await User.create({
        name: 'Admin User',
        email: 'admin@foodies.com',
        password: 'admin123',
        role: 'admin',
        phone: '1234567890'
      });
      console.log('Admin user created:', newUser);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkAdmin();
