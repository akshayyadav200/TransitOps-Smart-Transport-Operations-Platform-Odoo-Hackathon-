import { createServer } from "node:http";
import mongoose from "mongoose";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env, validateEnvironment } from "./config/env.js";

validateEnvironment();
const app = createApp();
const server = createServer(app);

await connectDatabase();

server.listen(env.port, () => {
  console.log(`TransitOps API listening on port ${env.port}`);
});

function shutdown(signal) {
  console.log(`${signal} received. Closing TransitOps API.`);
  server.close(async () => {
    await mongoose.connection.close(false);
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
