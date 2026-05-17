import express from 'express';

import {
  getDonationsSummary,
  getProjectsReport,
  getTransparencyReport,
  getDashboardMetrics
} from '../Controller/reportcontroller';

const router = express.Router();

router.get('/reports/donations-summary', getDonationsSummary);

router.get('/reports/projects', getProjectsReport);

router.get('/reports/transparency', getTransparencyReport);

router.get('/dashboard', getDashboardMetrics);

export default router;