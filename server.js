import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const connectDB = require('./config/database');
connectDB();

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Welcome to the NGO Management System! Group 11");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
