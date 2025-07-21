import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log("🔍 MONGO_URI is:", process.env.MONGO_URI); // Add this line

    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
