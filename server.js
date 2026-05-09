import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config({ path: ".env.local" });

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the NGO Management System! Group 11");
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
