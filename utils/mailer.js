import nodemailer from "nodemailer";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const mailHost = process.env.MAIL_HOST || process.env.SMTP_HOST;
const mailPort = Number(process.env.MAIL_PORT || process.env.SMTP_PORT || 587);
const mailUser = process.env.MAIL_USER || process.env.SMTP_USER;
const mailPass = process.env.MAIL_PASS || process.env.SMTP_PASS;

const transporter = nodemailer.createTransport({
  host: mailHost,
  port: mailPort,
  secure: mailPort === 465,
  auth: {
    user: mailUser,
    pass: mailPass,
  },
});

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

export default transporter;
