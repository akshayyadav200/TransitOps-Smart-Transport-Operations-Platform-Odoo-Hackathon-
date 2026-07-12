import dns from "node:dns";
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
    if (env.dnsResolvers.length > 0) {
      dns.setServers(env.dnsResolvers);
    }

    await mongoose.connect(env.databaseUrl, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("Database connected");
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    throw error;
  }
}

export function getDatabaseState() {
  return CONNECTION_STATES[mongoose.connection.readyState] ?? "unknown";
}
