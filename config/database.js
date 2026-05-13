import mongoose from "mongoose";

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
        console.error("MongoDB connection error:", error.message);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn("MongoDB disconnected");
      });

      listenersRegistered = true;
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    const health = getDatabaseHealth();
    console.log(`MongoDB connected`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
