import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  // Prevent multiple connections in serverless
  if (isConnected && mongoose.connection.readyState === 1) {
    console.log("Using existing MongoDB connection");
    return;
  }

  // Prevent deprecated warnings
  mongoose.set('strictQuery', true);

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    isConnected = true;
    console.log("MongoDB Connected:", conn.connection.host);
    
    // Handle disconnection
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      isConnected = false;
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB error:', err);
      isConnected = false;
    });

    return conn;
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    isConnected = false;
    throw error;
  }
};

export default connectDB;