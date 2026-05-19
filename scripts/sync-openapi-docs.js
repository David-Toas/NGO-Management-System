import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const sourcePath = path.resolve(
  rootDir,
  "..",
  "NGO Management System API Docs",
  "openapi.json",
);
const destinationPath = path.resolve(rootDir, "docs", "openapi.json");

if (!fs.existsSync(sourcePath)) {
  throw new Error(`OpenAPI source file not found: ${sourcePath}`);
}

fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
fs.copyFileSync(sourcePath, destinationPath);

console.log(`Synced OpenAPI document to ${destinationPath}`);
