import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Mongodb connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};
export default connectDB;
