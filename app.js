import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import morgan from "morgan";
import { getDatabaseHealth } from "./config/database.js";
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donation.routes.js";
import donorRoutes from "./routes/donor.routes.js";
import eventRoutes from "./routes/event.routes.js";
import projectRoutes from "./routes/project.routes.js";
import volunteerRoutes from "./routes/volunteer.js";
import beneficiaryRoutes from "./routes/beneficiary.js";
import {
  getDashboardMetrics,
  getDonationsSummary,
  getProjectsReport,
  getTransparencyReport,
} from "./controllers/reportcontroller.js";
import errorHandler from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import { morganStream } from "./utils/logger.js";
import logger from "./utils/logger.js";
import renderApiRootPage from "./utils/renderApiRootPage.js";
import paymentRoutes from "./routes/payment.js";

// Only load .env in development; Vercel injects vars automatically in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Improved OpenAPI document loading with better path resolution
let openApiDocument = null;
const openApiDocumentCandidates = [
  path.join(__dirname, "docs", "openapi.json"),
  path.join(__dirname, "..", "NGO Management System API Docs", "openapi.json"),
];

for (const candidatePath of openApiDocumentCandidates) {
  try {
    if (fs.existsSync(candidatePath)) {
      const fileContent = fs.readFileSync(candidatePath, "utf8");
      openApiDocument = JSON.parse(fileContent);
      logger.info(`OpenAPI document loaded from: ${candidatePath}`);
      break;
    }
  } catch (error) {
    logger.warn(
      `Failed to load OpenAPI document from ${candidatePath}:`,
      error.message,
    );
  }
}

if (!openApiDocument) {
  logger.warn("OpenAPI document not found at any candidate path");
}

if (openApiDocument) {
  const publicBaseUrl =
    process.env.PUBLIC_BASE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ||
    `http://localhost:${PORT}`;

  openApiDocument.servers = [
    {
      url: publicBaseUrl,
      description:
        process.env.NODE_ENV === "production"
          ? "Production server"
          : "Local development server",
    },
  ];
}

app.use(express.json());
app.use("/api/payment", paymentRoutes);
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  }),
);
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: morganStream,
  }),
);

app.get("/", async (req, res) => {
  // Trigger connection attempt if not already connected
  try {
    if (getDatabaseHealth().status !== "connected") {
      await connectDB();
    }
  } catch (err) {
    logger.error("Connection attempt failed on homepage", {
      errorMessage: err.message,
    });
  }

  const db = getDatabaseHealth();
  const smtpConfigured = Boolean(
    process.env.MAIL_HOST ||
    process.env.SMTP_HOST ||
    process.env.MAIL_USER ||
    process.env.SMTP_USER,
  );

  res.type("html").send(
    renderApiRootPage({
      port: PORT,
      env: process.env.NODE_ENV || "development",
      dbStatus: db.status,
      smtpConfigured,
      requestIp: req.ip,
      uptimeSeconds: Math.floor(process.uptime()),
    }),
  );
});

app.get("/api/health", async (req, res) => {
  // Trigger connection attempt if not already connected
  try {
    if (getDatabaseHealth().status !== "connected") {
      await connectDB();
    }
  } catch (err) {
    logger.error("Connection attempt failed on health check", {
      errorMessage: err.message,
    });
  }

  const db = getDatabaseHealth();
  const statusCode = db.status === "connected" ? 200 : 503;

  res.status(statusCode).json({
    status: db.status === "connected" ? "ok" : "degraded",
    service: "ngo-management-system",
    database: db,
  });
});

app.get("/api/health/db", async (req, res) => {
  // Trigger connection attempt if not already connected
  try {
    if (getDatabaseHealth().status !== "connected") {
      await connectDB();
    }
  } catch (err) {
    logger.error("Connection attempt failed on db health check", {
      errorMessage: err.message,
    });
  }

  const db = getDatabaseHealth();
  const statusCode = db.status === "connected" ? 200 : 503;
  res.status(statusCode).json(db);
});

app.get("/api/docs.json", (req, res) => {
  if (!openApiDocument) {
    return res.status(404).json({
      message: "OpenAPI document not found.",
    });
  }

  return res.json(openApiDocument);
});

if (openApiDocument) {
  const swaggerUiOptions = {
    customSiteTitle: "NGO Management System API Docs",
    swaggerOptions: {
      url: "/api/docs.json",
    },
  };

  app.use(
    "/api/docs",
    swaggerUi.serveFiles(null, swaggerUiOptions),
    swaggerUi.setup(openApiDocument, swaggerUiOptions),
  );
}

app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.get("/api/reports/donations-summary", getDonationsSummary);
app.get("/api/reports/projects", getProjectsReport);
app.get("/api/reports/transparency", getTransparencyReport);
app.get("/api/reports/dashboard", getDashboardMetrics);

app.use(errorHandler);

export default app;
