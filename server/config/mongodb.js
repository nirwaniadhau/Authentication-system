import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("🔄 Trying to connect to MongoDB...");

    await mongoose.connect(process.env.MONGO_URL);

    console.log("✅ Connected to MongoDB"); // <-- this is your key check
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};

export default connectDB;
