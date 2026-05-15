import * as donorService from "../services/donor.service.js";

const isAdminOrStaff = (authUser) =>
  authUser.role === "admin" || authUser.role === "staff";

const canAccessDonor = (authUser, donor) =>
  isAdminOrStaff(authUser) || donor.user._id.toString() === authUser.id;

const isDonorOwner = (authUser, donor) =>
  donor.user._id.toString() === authUser.id;

export const createDonor = async (req, res) => {
  try {
    const { userId, phone, address, donorType, organizationName } = req.body;

    if (!isAdminOrStaff(req.user) && userId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message:
          "You can only create a donor profile for your own user account",
      });
    }

    const donor = await donorService.createDonor({
      userId,
      phone,
      address,
      donorType,
      organizationName,
    });

    return res.status(201).json({
      success: true,
      message: "Donor profile created successfully",
      data: donor,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllDonors = async (req, res) => {
  try {
    const { page, limit, donorType, isActive } = req.query;

    const result = await donorService.getAllDonors({
      page,
      limit,
      donorType,
      isActive,
    });

    return res.status(200).json({
      success: true,
      message: "Donors retrieved successfully",
      data: result.donors,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getDonorById = async (req, res) => {
  try {
    const donor = await donorService.getDonorById(req.params.id);

    if (!canAccessDonor(req.user, donor)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Donor retrieved successfully",
      data: donor,
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDonor = async (req, res) => {
  try {
    const current = await donorService.getDonorById(req.params.id);

    if (!canAccessDonor(req.user, current)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    if (!current.isActive && !isAdminOrStaff(req.user)) {
      return res.status(400).json({
        success: false,
        message: "Inactive donors cannot update their profile",
      });
    }

    const donor = await donorService.updateDonor(req.params.id, { ...req.body });

    return res.status(200).json({
      success: true,
      message: "Donor updated successfully",
      data: donor,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deactivateDonor = async (req, res) => {
  try {
    const current = await donorService.getDonorById(req.params.id);

    if (!isDonorOwner(req.user, current)) {
      return res.status(403).json({
        success: false,
        message: "Only the donor who owns this profile can deactivate it",
      });
    }

    const result = await donorService.deactivateDonor(req.params.id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

export const reactivateDonor = async (req, res) => {
  try {
    const donor = await donorService.reactivateDonor(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Donor reactivated successfully",
      data: donor,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};
