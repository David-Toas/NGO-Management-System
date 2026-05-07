import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

dotenv.config();

const app = express();

<<<<<<< David-auth
=======
const connectDB = require("./config/database");
>>>>>>> development
connectDB();

const PORT = process.env.PORT || 8000;

app.get("/", (req, res) => {
  res.send("Welcome to the NGO Management System! Group 11");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
