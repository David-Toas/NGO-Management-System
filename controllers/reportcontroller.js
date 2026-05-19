import {
  fetchDonationsSummary,
  fetchProjectsReport,
  fetchTransparencyReport,
  fetchDashboardMetrics,
} from "../models/report.js";

export const getDonationsSummary = async (req, res) => {
  try {
    const data = await fetchDonationsSummary();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate donations summary",
      error: error.message,
    });
  }
};

export const getProjectsReport = async (req, res) => {
  try {
    const data = await fetchProjectsReport(req.query);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate projects report",
      error: error.message,
    });
  }
};

export const getTransparencyReport = async (req, res) => {
  try {
    const data = await fetchTransparencyReport();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to generate transparency report",
      error: error.message,
    });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const data = await fetchDashboardMetrics();

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load dashboard metrics",
      error: error.message,
    });
  }
};
