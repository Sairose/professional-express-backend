
import mongoose from "mongoose";

import { env } from "./env.js";

/**
 * Connect the application to MongoDB.
 *
 * Mongoose reuses its default connection for models
 * unless a separate connection is explicitly created.
 */
export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);

    console.log("MongoDB connected successfully");
  } catch (error: unknown) {
    console.error("MongoDB connection failed:", error);

    throw error;
  }
}
