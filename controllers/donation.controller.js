import * as donationService from "../services/donation.service.js";
import * as donorService from "../services/donor.service.js";

const canAccessDonor = (authUser, donorUserId) =>
  authUser.role === "admin" || donorUserId.toString() === authUser.id;

export const createDonation = async (req, res) => {
  try {
    let donorId = req.body.donorId;

    if (req.user.role !== "admin") {
      const donor = await donorService.getDonorByUserId(req.user.id);
      donorId = donor._id;
    }

    const donation = await donationService.createDonation({
      donorId,
      projectId: req.body.projectId,
      amount: req.body.amount,
      currency: req.body.currency,
      donationType: req.body.donationType,
      notes: req.body.notes,
    });

    return res.status(201).json({
      success: true,
      message: "Donation recorded successfully",
      data: donation,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllDonations = async (req, res) => {
  try {
    const { page, limit, status, donationType } = req.query;

    const result = await donationService.getAllDonations({
      page,
      limit,
      status,
      donationType,
    });

    return res.status(200).json({
      success: true,
      message: "Donations retrieved successfully",
      data: result.donations,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await donationService.getDonationById(req.params.id);

    if (!canAccessDonor(req.user, donation.donor.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Donation retrieved successfully",
      data: donation,
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDonationsByDonor = async (req, res) => {
  try {
    const { page, limit } = req.query;

    const result = await donationService.getDonationsByDonor(req.params.donorId, {
      page,
      limit,
    });

    if (!canAccessDonor(req.user, result.donor.userId)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Donor donations retrieved successfully",
      data: result,
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDonation = async (req, res) => {
  try {
    const donation = await donationService.updateDonation(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: "Donation updated successfully",
      data: donation,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};
