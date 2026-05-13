import Donation from "../models/Donation.js";
import Donor from "../models/Donor.js";
import Project from "../models/Project.js";
import { sendDonationConfirmationMail } from "./mail.service.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const findDonorRecord = async (identifier) => {
  let donor = await Donor.findById(identifier).populate("user", "name email role");

  if (!donor) {
    donor = await Donor.findOne({ user: identifier }).populate(
      "user",
      "name email role"
    );
  }

  return donor;
};

const generateReference = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `NGO-DON-${timestamp}-${random}`;
};

const applyDonationImpact = async (donation, multiplier) => {
  await Donor.findByIdAndUpdate(donation.donor, {
    $inc: { totalDonated: donation.amount * multiplier },
  });

  if (donation.project) {
    await Project.findByIdAndUpdate(donation.project, {
      $inc: { amountReceived: donation.amount * multiplier },
      ...(multiplier > 0
        ? { $addToSet: { donors: donation.donor } }
        : {}),
    });
  }
};

export const createDonation = async (donationData) => {
  const { donorId, projectId, amount, currency, donationType, notes } =
    donationData;

  const donor = await findDonorRecord(donorId);
  if (!donor) {
    throw createError(
      "Donor not found for the provided donor profile ID or user ID",
      404
    );
  }

  if (!donor.isActive) {
    throw createError("Donor account is inactive", 400);
  }

  let project = null;
  if (projectId) {
    project = await Project.findById(projectId);
    if (!project) {
      throw createError("Project not found", 404);
    }

    if (project.status === "cancelled") {
      throw createError("Cannot donate to a cancelled project", 400);
    }
  }

  const donation = await Donation.create({
    donor: donor._id,
    project: projectId || null,
    amount: Number(amount),
    currency: (currency || "NGN").toUpperCase(),
    donationType: donationType || "transfer",
    reference: generateReference(),
    notes,
  });

  if (donation.status === "confirmed") {
    await applyDonationImpact(donation, 1);
  }

  try {
    await sendDonationConfirmationMail({
      name: donor.user.name,
      email: donor.user.email,
      amount: donation.amount,
      currency: donation.currency,
      projectName: project ? project.title : null,
      reference: donation.reference,
    });
  } catch (mailError) {
    console.error("Donation confirmation email failed:", mailError.message);
  }

  return donation.populate([
    { path: "donor", populate: { path: "user", select: "name email role" } },
    { path: "project", select: "title status amountReceived" },
  ]);
};

export const getAllDonations = async ({
  page = 1,
  limit = 10,
  status,
  donationType,
}) => {
  const query = {};

  if (status) {
    query.status = status;
  }

  if (donationType) {
    query.donationType = donationType;
  }

  const numericPage = Number(page);
  const numericLimit = Number(limit);
  const skip = (numericPage - 1) * numericLimit;

  const [donations, total] = await Promise.all([
    Donation.find(query)
      .populate({ path: "donor", populate: { path: "user", select: "name email role" } })
      .populate("project", "title status amountReceived")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(numericLimit),
    Donation.countDocuments(query),
  ]);

  return {
    donations,
    pagination: {
      total,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.ceil(total / numericLimit),
    },
  };
};

export const getDonationById = async (donationId) => {
  const donation = await Donation.findById(donationId)
    .populate({ path: "donor", populate: { path: "user", select: "name email role" } })
    .populate("project", "title status budget amountReceived");

  if (!donation) {
    throw createError("Donation not found", 404);
  }

  return donation;
};

export const getDonationsByDonor = async (donorId, { page = 1, limit = 10 }) => {
  const donor = await findDonorRecord(donorId);
  if (!donor) {
    throw createError(
      "Donor not found for the provided donor profile ID or user ID",
      404
    );
  }

  const numericPage = Number(page);
  const numericLimit = Number(limit);
  const skip = (numericPage - 1) * numericLimit;

  const [donations, total] = await Promise.all([
    Donation.find({ donor: donor._id })
      .populate("project", "title status amountReceived")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(numericLimit),
    Donation.countDocuments({ donor: donor._id }),
  ]);

  return {
    donor: {
      id: donor._id,
      userId: donor.user._id,
      name: donor.user.name,
      email: donor.user.email,
      totalDonated: donor.totalDonated,
      isActive: donor.isActive,
    },
    donations,
    pagination: {
      total,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.ceil(total / numericLimit),
    },
  };
};

export const updateDonation = async (donationId, updateData) => {
  const donation = await Donation.findById(donationId);
  if (!donation) {
    throw createError("Donation not found", 404);
  }

  const previousStatus = donation.status;
  const nextStatus = updateData.status || previousStatus;

  donation.status = nextStatus;
  if (updateData.notes !== undefined) {
    donation.notes = updateData.notes;
  }

  await donation.save();

  if (previousStatus !== nextStatus) {
    if (previousStatus !== "confirmed" && nextStatus === "confirmed") {
      await applyDonationImpact(donation, 1);
    }

    if (previousStatus === "confirmed" && nextStatus !== "confirmed") {
      await applyDonationImpact(donation, -1);
    }
  }

  return Donation.findById(donationId)
    .populate({ path: "donor", populate: { path: "user", select: "name email role" } })
    .populate("project", "title status amountReceived");
};
