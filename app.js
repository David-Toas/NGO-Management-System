import express from "express";
import dotenv from "dotenv";
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
import { morganStream } from "./utils/logger.js";
import logger from "./utils/logger.js";
import renderApiRootPage from "./utils/renderApiRootPage.js";
import paymentRoutes from "./routes/payment.js";
import openApiDocument from "./docs/openapi.js";

// Only load .env in development; Vercel injects vars automatically in production
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: ".env" });
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// ─── Update OpenAPI servers for the environment ───────────────────────────────
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

  logger.info("OpenAPI servers configured", {
    environment: process.env.NODE_ENV,
    baseUrl: publicBaseUrl,
  });
}

app.use(express.json());
app.use("/api/payment", paymentRoutes);

// ─── Helmet — Security Headers ────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "cdn.jsdelivr.net",
        ],
        styleSrc: ["'self'", "'unsafe-inline'", "cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "https:"],
        fontSrc: [
          "'self'",
          "data:",
          "fonts.googleapis.com",
          "fonts.gstatic.com",
          "cdn.jsdelivr.net",
        ],
        workerSrc: ["'self'", "blob:"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
);

// ─── Morgan — Request Logging ─────────────────────────────────────────────────
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev", {
    stream: morganStream,
  }),
);

// ─── Root Page ────────────────────────────────────────────────────────────────
app.get("/", async (req, res) => {
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

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", async (req, res) => {
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

// ─── DB Health Check ──────────────────────────────────────────────────────────
app.get("/api/health/db", async (req, res) => {
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

// ─── Swagger JSON ─────────────────────────────────────────────────────────────
app.get("/api/docs.json", (req, res) => {
  if (!openApiDocument) {
    logger.error("OpenAPI document not found on /api/docs.json");
    return res.status(404).json({
      message: "OpenAPI document not found.",
    });
  }

  res.setHeader("Content-Type", "application/json");
  logger.debug("Serving OpenAPI document", {
    pathsCount: Object.keys(openApiDocument.paths || {}).length,
  });
  return res.json(openApiDocument);
});

// ─── Swagger UI — CDN approach (works reliably on Vercel) ────────────────────
if (openApiDocument) {
  app.get("/api/docs", (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NGO Management System API Docs</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
        <style>
          body { margin: 0; padding: 0; }
          .swagger-ui .topbar { background-color: #2D6A4F; }
          .swagger-ui .topbar .download-url-wrapper { display: none; }
        </style>
      </head>
      <body>
        <div id="swagger-ui"></div>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
        <script>
          window.onload = function () {
            SwaggerUIBundle({
              url: "/api/docs.json",
              dom_id: "#swagger-ui",
              presets: [
                SwaggerUIBundle.presets.apis,
                SwaggerUIStandalonePreset
              ],
              plugins: [SwaggerUIBundle.plugins.DownloadUrl],
              layout: "StandaloneLayout",
              deepLinking: true,
              filter: true,
              tryItOutEnabled: true,
            });
          };
        </script>
      </body>
      </html>
    `);
  });

  logger.info("Swagger UI initialized via CDN", {
    paths: Object.keys(openApiDocument.paths || {}).length,
  });
}

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/donors", donorRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);

// ─── Report Routes ────────────────────────────────────────────────────────────
app.get("/api/reports/donations-summary", getDonationsSummary);
app.get("/api/reports/projects", getProjectsReport);
app.get("/api/reports/transparency", getTransparencyReport);
app.get("/api/reports/dashboard", getDashboardMetrics);

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

export default app;
