import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import winston from "winston";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logsDir = path.resolve(__dirname, "../logs");
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const { combine, timestamp, errors, json, colorize, printf } = winston.format;

const consoleFormat = printf(({ level, message, timestamp: ts, ...meta }) => {
  const metadata = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : "";
  return `${ts} ${level}: ${message}${metadata}`;
});

const transports = [
  new winston.transports.Console({
    format:
      process.env.NODE_ENV === "production"
        ? combine(timestamp(), errors({ stack: true }), json())
        : combine(
            colorize(),
            timestamp(),
            errors({ stack: true }),
            consoleFormat
          ),
  }),
];

if (!isServerless) {
  try {
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }

    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, "error.log"),
        level: "error",
      }),
      new winston.transports.File({
        filename: path.join(logsDir, "combined.log"),
      })
    );
  } catch (error) {
    console.warn("File logging disabled", error.message);
  }
}

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: "ngo-management-system" },
  transports,
});

export const morganStream = {
  write: (message) => {
    logger.info(message.trim(), { source: "http" });
  },
};

export default logger;
