import app from "../app.js";
import connectDB from "../config/database.js";
import logger from "../utils/logger.js";

export default async function handler(req, res) {
  try {
    await connectDB();
  } catch (error) {
    logger.error("Serverless startup failed", {
      errorMessage: error.message,
      stack: error.stack,
    });
    // Return error response for connection failures
    return res.status(500).json({
      status: "error",
      message: "Database connection failed",
      error: error.message,
    });
  }

  return app(req, res);
}
