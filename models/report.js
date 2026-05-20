import Donation from "./Donation.js";
import Donor from "./Donor.js";
import Project from "./Project.js";

const sumByKey = (rows, keyField, valueField) =>
  rows.reduce((acc, row) => {
    acc[row[keyField]] = row[valueField];
    return acc;
  }, {});

export const fetchDonationsSummary = async () => {
  const [overview] = await Donation.aggregate([
    {
      $group: {
        _id: null,
        totalDonations: { $sum: "$amount" },
        donationCount: { $sum: 1 },
        averageDonation: { $avg: "$amount" },
      },
    },
  ]);

  const [byStatusRows, byTypeRows] = await Promise.all([
    Donation.aggregate([
      {
        $group: {
          _id: "$status",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),
    Donation.aggregate([
      {
        $group: {
          _id: "$donationType",
          totalAmount: { $sum: "$amount" },
        },
      },
    ]),
  ]);

  return {
    totalDonations: overview?.totalDonations || 0,
    donationCount: overview?.donationCount || 0,
    averageDonation: Math.round(overview?.averageDonation || 0),
    byStatus: sumByKey(
      byStatusRows.map((row) => ({ status: row._id, totalAmount: row.totalAmount })),
      "status",
      "totalAmount",
    ),
    byType: sumByKey(
      byTypeRows.map((row) => ({ donationType: row._id, totalAmount: row.totalAmount })),
      "donationType",
      "totalAmount",
    ),
  };
};

export const fetchProjectsReport = async ({
  status,
  year,
  startDate,
  endDate,
  page = 1,
  limit = 10,
} = {}) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (year) {
    const numericYear = Number(year);
    if (!Number.isNaN(numericYear)) {
      query.startDate = {
        $gte: new Date(`${numericYear}-01-01T00:00:00.000Z`),
        $lt: new Date(`${numericYear + 1}-01-01T00:00:00.000Z`),
      };
    }
  }

  if (startDate || endDate) {
    query.startDate = {
      ...(query.startDate || {}),
      ...(startDate ? { $gte: new Date(startDate) } : {}),
      ...(endDate ? { $lte: new Date(endDate) } : {}),
    };
  }

  const numericPage = Number(page) || 1;
  const numericLimit = Number(limit) || 10;
  const skip = (numericPage - 1) * numericLimit;

  const [projects, totalProjects, statusRows, totals] = await Promise.all([
    Project.find(query).sort({ createdAt: -1 }).skip(skip).limit(numericLimit).lean(),
    Project.countDocuments(query),
    Project.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]),
    Project.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: "$budget" },
          totalReceived: { $sum: "$amountReceived" },
          totalSpent: { $sum: "$amountSpent" },
        },
      },
    ]),
  ]);

  const summary = totals?.[0] || {};

  return {
    totalProjects,
    page: numericPage,
    limit: numericLimit,
    totalPages: Math.ceil(totalProjects / numericLimit) || 0,
    projectsByStatus: sumByKey(
      statusRows.map((row) => ({ status: row._id, count: row.count })),
      "status",
      "count",
    ),
    totalBudget: summary.totalBudget || 0,
    totalReceived: summary.totalReceived || 0,
    totalSpent: summary.totalSpent || 0,
    balance: (summary.totalReceived || 0) - (summary.totalSpent || 0),
    projects,
  };
};

export const fetchTransparencyReport = async () => {
  const [donationTotals, projectTotals, donorCount] = await Promise.all([
    Donation.aggregate([
      {
        $match: { status: "confirmed" },
      },
      {
        $group: {
          _id: null,
          totalFundsReceived: { $sum: "$amount" },
        },
      },
    ]),
    Project.aggregate([
      {
        $group: {
          _id: null,
          totalFundsUsed: { $sum: "$amountSpent" },
          projectsFunded: { $sum: 1 },
        },
      },
    ]),
    Donor.countDocuments(),
  ]);

  const received = donationTotals?.[0]?.totalFundsReceived || 0;
  const used = projectTotals?.[0]?.totalFundsUsed || 0;
  const projectsFunded = projectTotals?.[0]?.projectsFunded || 0;

  return {
    totalFundsReceived: received,
    totalFundsUsed: used,
    remainingBalance: received - used,
    projectsFunded,
    donorCount,
    generatedAt: new Date().toISOString(),
  };
};

export const fetchDashboardMetrics = async () => {
  const [projectCounts, totalDonationsRow, totalDonors, recentDonations] =
    await Promise.all([
      Project.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
      Donation.aggregate([
        {
          $match: { status: "confirmed" },
        },
        {
          $group: {
            _id: null,
            totalDonations: { $sum: "$amount" },
          },
        },
      ]),
      Donor.countDocuments({ isActive: true }),
      Donation.find({ status: "confirmed" })
        .populate({ path: "donor", populate: { path: "user", select: "name email" } })
        .populate("project", "title")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  const counts = sumByKey(
    projectCounts.map((row) => ({ status: row._id, count: row.count })),
    "status",
    "count",
  );

  return {
    totalDonors,
    totalDonations: totalDonationsRow?.[0]?.totalDonations || 0,
    activeProjects: counts.ongoing || 0,
    completedProjects: counts.completed || 0,
    plannedProjects: counts.planned || 0,
    cancelledProjects: counts.cancelled || 0,
    recentDonations: recentDonations.map((donation) => ({
      id: donation._id,
      amount: donation.amount,
      currency: donation.currency,
      status: donation.status,
      donorName: donation.donor?.user?.name || null,
      donorEmail: donation.donor?.user?.email || null,
      projectTitle: donation.project?.title || null,
      createdAt: donation.createdAt,
    })),
  };
};
