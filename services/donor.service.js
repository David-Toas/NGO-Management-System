import Donor from "../models/Donor.js";
import User from "../models/User.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const findDonorRecord = async (identifier, populateUser = false) => {
  let query = Donor.findById(identifier);

  if (populateUser) {
    query = query.populate("user", "name email role");
  }

  let donor = await query;

  if (!donor) {
    query = Donor.findOne({ user: identifier });

    if (populateUser) {
      query = query.populate("user", "name email role");
    }

    donor = await query;
  }

  return donor;
};

export const createDonor = async (donorData) => {
  const { userId, phone, address, donorType, organizationName } = donorData;

  const user = await User.findById(userId);
  if (!user) {
    throw createError("User not found", 404);
  }

  const existingDonor = await Donor.findOne({ user: userId });
  if (existingDonor) {
    throw createError("Donor profile already exists for this user", 409);
  }

  const donor = await Donor.create({
    user: userId,
    phone,
    address,
    donorType,
    organizationName:
      donorType === "organization" ? organizationName : undefined,
  });

  await User.findByIdAndUpdate(userId, { role: "donor" });

  return donor.populate("user", "name email role");
};

export const getAllDonors = async ({
  page = 1,
  limit = 10,
  donorType,
  isActive,
}) => {
  const query = {};

  if (donorType) {
    query.donorType = donorType;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const numericPage = Number(page);
  const numericLimit = Number(limit);
  const skip = (numericPage - 1) * numericLimit;

  const [donors, total] = await Promise.all([
    Donor.find(query)
      .populate("user", "name email role")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(numericLimit),
    Donor.countDocuments(query),
  ]);

  return {
    donors,
    pagination: {
      total,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.ceil(total / numericLimit),
    },
  };
};

export const getDonorById = async (donorId) => {
  const donor = await findDonorRecord(donorId, true);

  if (!donor) {
    throw createError("Donor not found for the provided donor ID or user ID", 404);
  }

  return donor;
};

export const getDonorByUserId = async (userId) => {
  const donor = await Donor.findOne({ user: userId }).populate(
    "user",
    "name email role"
  );

  if (!donor) {
    throw createError("Donor profile not found for this user", 404);
  }

  return donor;
};

export const updateDonor = async (donorId, updateData) => {
  const donor = await findDonorRecord(donorId);
  if (!donor) {
    throw createError("Donor not found for the provided donor ID or user ID", 404);
  }

  delete updateData.user;
  delete updateData.userId;
  delete updateData.totalDonated;

  if (updateData.donorType === "individual") {
    updateData.organizationName = undefined;
  }

  const updated = await Donor.findByIdAndUpdate(donor._id, updateData, {
    new: true,
    runValidators: true,
  }).populate("user", "name email role");

  return updated;
};

export const deactivateDonor = async (donorId) => {
  const donor = await findDonorRecord(donorId);
  if (!donor) {
    throw createError("Donor not found for the provided donor ID or user ID", 404);
  }

  if (!donor.isActive) {
    throw createError("Donor is already inactive", 400);
  }

  donor.isActive = false;
  await donor.save();

  return { message: "Donor deactivated successfully" };
};

export const reactivateDonor = async (donorId) => {
  const donor = await findDonorRecord(donorId);
  if (!donor) {
    throw createError("Donor not found for the provided donor ID or user ID", 404);
  }

  if (donor.isActive) {
    throw createError("Donor is already active", 400);
  }

  donor.isActive = true;
  await donor.save();

  return donor.populate("user", "name email role");
};
