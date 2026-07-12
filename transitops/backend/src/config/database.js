import mongoose from "mongoose";
import { env } from "./env.js";

const CONNECTION_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting"
};

export async function connectDatabase() {
  try {
    await mongoose.connect(env.databaseUrl, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("Database connected");
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
  }
}

export function getDatabaseState() {
  return CONNECTION_STATES[mongoose.connection.readyState] ?? "unknown";
}
