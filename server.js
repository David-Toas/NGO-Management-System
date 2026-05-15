import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import helmet from "helmet";
import morgan from "morgan";
import connectDB, { getDatabaseHealth } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donation.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import errorHandler from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import logger, { morganStream } from "./utils/logger.js";
import renderApiRootPage from "./utils/renderApiRootPage.js";

dotenv.config({ path: ".env" });

const app = express();
const PORT = process.env.PORT || 8000;
const openApiDocumentPath =
  "C:/Users/Toas/Desktop/NGO Management System API Docs/openapi.json";
const openApiDocument = JSON.parse(
  fs.readFileSync(openApiDocumentPath, "utf8")
);

openApiDocument.servers = [
  {
    url: `http://localhost:${PORT}`,
    description: "Local development server",
  },
];

app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: morganStream,
  })
);

app.get("/", (req, res) => {
  const db = getDatabaseHealth();
  const smtpConfigured = Boolean(
    process.env.MAIL_HOST ||
      process.env.SMTP_HOST ||
      process.env.MAIL_USER ||
      process.env.SMTP_USER
  );

  res.type("html").send(
    renderApiRootPage({
      port: PORT,
      env: process.env.NODE_ENV || "development",
      dbStatus: db.status,
      smtpConfigured,
      requestIp: req.ip,
      uptimeSeconds: Math.floor(process.uptime()),
    })
  );
});

app.get("/api/health", (req, res) => {
  const db = getDatabaseHealth();
  const statusCode = db.status === "connected" ? 200 : 503;

  res.status(statusCode).json({
    status: db.status === "connected" ? "ok" : "degraded",
    service: "ngo-management-system",
    database: db,
  });
});

app.get("/api/health/db", (req, res) => {
  const db = getDatabaseHealth();
  const statusCode = db.status === "connected" ? 200 : 503;

  res.status(statusCode).json(db);
});

app.get("/api/docs.json", (req, res) => {
  res.json(openApiDocument);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/donations", donationRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    logger.info("Server is running", {
      port: PORT,
      url: `http://localhost:${PORT}`,
    });
  });
});
