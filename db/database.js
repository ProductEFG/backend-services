import mongoose from "mongoose";

export const connectToDB = async () => {
  const connectionString = process.env.DATABASE_URL;
  try {
    // Wait for the mongoose connection to complete
    await mongoose.connect(connectionString);
    console.log("Connected to DB successfully");
  } catch (error) {
    // Log the error if the connection fails
    console.error("Failed to connect to DB", error);
  }
};
