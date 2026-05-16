

import {
  fetchDonationsSummary,
  fetchProjectsReport,
  fetchTransparencyReport,
  fetchDashboardMetrics
} from '../Models/report';

export const getDonationsSummary = (req, res) => {
  try {
    const data = fetchDonationsSummary();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to generate donations summary',
      error: error.message
    });
  }
};

export const getProjectsReport = (req, res) => {
  try {
    const data = fetchProjectsReport(req.query);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to generate projects report',
      error: error.message
    });
  }
};

export const getTransparencyReport = (req, res) => {
  try {
    const data = fetchTransparencyReport();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to generate transparency report',
      error: error.message
    });
  }
};

export const getDashboardMetrics = (req, res) => {
  try {
    const data = fetchDashboardMetrics();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to load dashboard metrics',
      error: error.message
    });
  }
};