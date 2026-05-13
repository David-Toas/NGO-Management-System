import nodemailer from "nodemailer";
import dotenv from "dotenv";

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
    console.error("Mail server connection failed:", error);
  } else {
    console.log("Mail server is ready to send emails");
  }
});

export default transporter;
