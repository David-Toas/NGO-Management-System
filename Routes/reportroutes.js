import express from "express";

import {
  getDonationsSummary,
  getProjectsReport,
  getTransparencyReport,
  getDashboardMetrics,
} from "../controllers/reportcontroller.js";

const router = express.Router();

router.get("/donations-summary", getDonationsSummary);

router.get("/projects", getProjectsReport);

router.get("/transparency", getTransparencyReport);

router.get("/dashboard", getDashboardMetrics);

export default router;
