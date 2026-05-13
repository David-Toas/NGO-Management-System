import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import swaggerUi from "swagger-ui-express";

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

app.get("/", (req, res) => {
  res.send("Welcome to the NGO Management System! Group 11");
});

app.get("/api/docs.json", (req, res) => {
  res.json(openApiDocument);
});
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/api/auth", authRoutes);

app.use(errorHandler);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
