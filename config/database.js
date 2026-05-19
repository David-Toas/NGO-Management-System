import mongoose from "mongoose";
import logger from "../utils/logger.js";

const READY_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

let listenersRegistered = false;
let connectionPromise;

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
  const mongoUri = process.env.MONGODB_URI;
  const nodeEnv = process.env.NODE_ENV;

  // Debug: Log environment info
  logger.info("Database connection attempt", {
    NODE_ENV: nodeEnv,
    mongoUriExists: !!mongoUri,
    mongoUriLength: mongoUri?.length || 0,
    mongoUriStart: mongoUri?.substring(0, 20) || "undefined",
  });

  if (!mongoUri) {
    const error = new Error("MongoDB is not set in the environment");
    logger.error("MongoDB startup connection failed", {
      errorMessage: error.message,
      availableEnvVars: Object.keys(process.env).filter(
        (key) => key.includes("MONGO") || key.includes("DB"),
      ),
    });
    throw error;
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
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
  connectionPromise = mongoose
    .connect(mongoUri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
    })
    .then(() => {
      const health = getDatabaseHealth();
      logger.info("MongoDB connected", {
        database: health.database,
        host: health.host,
        port: health.port,
      });

      return mongoose.connection;
    });

  try {
    return await connectionPromise;
  } catch (err) {
    connectionPromise = undefined;
    logger.error("MongoDB startup connection failed", {
      errorMessage: err.message,
      errorCode: err.code,
      errorName: err.name,
      connectionState: mongoose.connection.readyState,
    });
    throw err;
  }
};

export default connectDB;
