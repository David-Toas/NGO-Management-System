import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const mailHost = process.env.MAIL_HOST || process.env.SMTP_HOST;
const mailPort = Number(process.env.MAIL_PORT || process.env.SMTP_PORT || 587);
const mailUser = process.env.MAIL_USER || process.env.SMTP_USER;
const mailPass = process.env.MAIL_PASS || process.env.SMTP_PASS;
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

const isMailConfigured = Boolean(mailHost && mailUser && mailPass);

const transporter = isMailConfigured
  ? nodemailer.createTransport({
      host: mailHost,
      port: mailPort,
      secure: mailPort === 465,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    })
  : null;

if (!isMailConfigured) {
  logger.warn("Mail transport is not configured");
} else if (!isServerless && process.env.NODE_ENV !== "production") {
  transporter.verify((error) => {
    if (error) {
      logger.error("Mail server connection failed", {
        errorMessage: error.message,
      });
    } else {
      logger.info("Mail server is ready to send emails", {
        host: mailHost,
        port: mailPort,
        user: mailUser,
      });
    }
  });
}

export const getTransporter = () => {
  if (!transporter) {
    throw new Error("Mail transport is not configured");
  }

  return transporter;
};

export default transporter;
