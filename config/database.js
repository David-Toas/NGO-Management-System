import mongoose from "mongoose";
import logger from "../utils/logger.js";

const READY_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

let listenersRegistered = false;

export const getDatabaseHealth = () => {
  const { readyState, name, host, port } = mongoose.connection;

  return {
    status: READY_STATES[readyState] || "unknown",
    readyState,
    database: name || null,
    host: host || null,
    port: port || null,
  };
};

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MongoDB is not set in the environment");
    }

    if (!listenersRegistered) {
      mongoose.connection.on("error", (error) => {
        logger.error("MongoDB connection error", {
          errorMessage: error.message,
        });
      });

      mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected");
      });

      listenersRegistered = true;
    }

    logger.info("Connecting to MongoDB");
    await mongoose.connect(mongoUri);
    const health = getDatabaseHealth();
    logger.info("MongoDB connected", {
      database: health.database,
      host: health.host,
      port: health.port,
    });
  } catch (err) {
    logger.error("MongoDB startup connection failed", {
      errorMessage: err.message,
    });
    process.exit(1);
  }
};

export default connectDB;
