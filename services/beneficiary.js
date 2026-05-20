import Beneficiary from "../models/Beneficiary.js";
import Project from "../models/Project.js";

//  Register Beneficiary
export const createBeneficiary = async (beneficiaryData, registeredBy) => {
  const {
    name,
    email,
    phone,
    nationalId,
    gender,
    dateOfBirth,
    address,
    projectId,
  } = beneficiaryData;

  // deduplication — check by nationalId
  if (nationalId) {
    const existing = await Beneficiary.findOne({ nationalId });
    if (existing) {
      throw new Error("A beneficiary with this National ID already exists");
    }
  }

  // fallback deduplication — check by name + phone
  if (phone) {
    const existingByPhone = await Beneficiary.findOne({ phone, name });
    if (existingByPhone) {
      throw new Error(
        "A beneficiary with this name and phone number already exists",
      );
    }
  }

  // check project exists if provided
  if (projectId) {
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found");
  }

  const beneficiary = await Beneficiary.create({
    name,
    email,
    phone,
    nationalId,
    gender,
    dateOfBirth,
    address,
    registeredBy,
    projects: projectId ? [projectId] : [],
  });

  // add beneficiary to project
  if (projectId) {
    await Project.findByIdAndUpdate(projectId, {
      $addToSet: { beneficiaries: beneficiary._id },
    });
  }

  return beneficiary.populate([
    { path: "projects", select: "title status" },
    { path: "registeredBy", select: "name email" },
  ]);
};

//  Get All Beneficiaries 
export const getAllBeneficiaries = async ({
  page = 1,
  limit = 10,
  gender,
  isActive,
  projectId,
}) => {
  const query = {};

  if (gender) query.gender = gender;
  if (isActive !== undefined) query.isActive = isActive === "true";
  if (projectId) query.projects = projectId;

  const skip = (page - 1) * limit;

  const [beneficiaries, total] = await Promise.all([
    Beneficiary.find(query)
      .populate("projects", "title status")
      .populate("registeredBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Beneficiary.countDocuments(query),
  ]);

  return {
    beneficiaries,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

//  Get Single Beneficiary 
export const getBeneficiaryById = async (beneficiaryId) => {
  const beneficiary = await Beneficiary.findById(beneficiaryId)
    .populate("projects", "title status startDate endDate")
    .populate("registeredBy", "name email");

  if (!beneficiary) throw new Error("Beneficiary not found");
  return beneficiary;
};

//  Update Beneficiary 
export const updateBeneficiary = async (beneficiaryId, updateData) => {
  const beneficiary = await Beneficiary.findById(beneficiaryId);
  if (!beneficiary) throw new Error("Beneficiary not found");

  // prevent changing registeredBy
  delete updateData.registeredBy;

  const updated = await Beneficiary.findByIdAndUpdate(
    beneficiaryId,
    updateData,
    { new: true, runValidators: true },
  ).populate([
    { path: "projects", select: "title status" },
    { path: "registeredBy", select: "name email" },
  ]);

  return updated;
};

//  Soft Delete Beneficiary 
export const deleteBeneficiary = async (beneficiaryId) => {
  const beneficiary = await Beneficiary.findById(beneficiaryId);
  if (!beneficiary) throw new Error("Beneficiary not found");

  beneficiary.isActive = false;
  await beneficiary.save();

  return { message: "Beneficiary deactivated successfully" };
};
