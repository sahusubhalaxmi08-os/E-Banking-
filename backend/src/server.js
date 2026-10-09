
import app from "./app.js";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";

let server;
let isShuttingDown = false;

async function startServer() {
  try {
    // Connect to MongoDB before accepting requests
    await connectDB();

    server = app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
      console.log(`Environment: ${env.nodeEnv}`);
    });

    server.on("error", (error) => {

      
      console.error("HTTP server error:", error.message);
      process.exitCode = 1;
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    await mongoose.disconnect().catch(() => {});
    process.exitCode = 1;
  }
}

async function shutdown(signal) {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log(`${signal} received. Shutting down...`);

  try {
    if (server) {
      await new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      });
    }

    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully.");
    process.exitCode = 0;
  } catch (error) {
    console.error("Error during shutdown:", error.message);
    process.exitCode = 1;
  }
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

startServer();

