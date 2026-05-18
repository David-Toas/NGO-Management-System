import app from "./app.js";
import connectDB from "./config/database.js";
import logger from "./utils/logger.js";

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info("Server is running", {
      port: PORT,
      url: `http://localhost:${PORT}`,
    });
  });
}).catch((error) => {
  logger.error("Server startup failed", {
    errorMessage: error.message,
    stack: error.stack,
  });
  process.exit(1);
});
