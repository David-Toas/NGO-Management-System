import Volunteer from "../models/Volunteer.js";
import User from "../models/User.js";
import Project from "../models/Project.js";

// ─── Register as Volunteer ────────────────────────────────────────────────────
export const createVolunteer = async (volunteerData) => {
  const { userId, skills, availability } = volunteerData;

  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const existing = await Volunteer.findOne({ user: userId });
  if (existing)
    throw new Error("Volunteer profile already exists for this user");

  const volunteer = await Volunteer.create({
    user: userId,
    skills,
    availability,
    status: "pending", // role stays "public" until admin approves
  });

  return volunteer.populate("user", "name email");
};

// ─── Get All Volunteers ───────────────────────────────────────────────────────
export const getAllVolunteers = async ({
  page = 1,
  limit = 10,
  status,
  availability,
}) => {
  const query = {};

  if (status) query.status = status;
  if (availability) query.availability = availability;

  const skip = (page - 1) * limit;

  const [volunteers, total] = await Promise.all([
    Volunteer.find(query)
      .populate("user", "name email")
      .populate("assignedProjects", "title status")
      .populate("approvedBy", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Volunteer.countDocuments(query),
  ]);

  return {
    volunteers,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ─── Get Single Volunteer ─────────────────────────────────────────────────────
export const getVolunteerById = async (volunteerId) => {
  const volunteer = await Volunteer.findById(volunteerId)
    .populate("user", "name email role")
    .populate("assignedProjects", "title status startDate endDate")
    .populate("approvedBy", "name email");

  if (!volunteer) throw new Error("Volunteer not found");
  return volunteer;
};

// ─── Approve Volunteer ────────────────────────────────────────────────────────
export const approveVolunteer = async (volunteerId, adminId) => {
  const volunteer = await Volunteer.findById(volunteerId);
  if (!volunteer) throw new Error("Volunteer not found");

  if (volunteer.status === "approved") {
    throw new Error("Volunteer is already approved");
  }

  volunteer.status = "approved";
  volunteer.approvedBy = adminId;
  await volunteer.save();

  // only upgrade role after admin approval
  await User.findByIdAndUpdate(volunteer.user, { role: "volunteer" });

  return volunteer.populate([
    { path: "user", select: "name email" },
    { path: "approvedBy", select: "name email" },
  ]);
};

// ─── Reject Volunteer ─────────────────────────────────────────────────────────
export const rejectVolunteer = async (volunteerId, adminId) => {
  const volunteer = await Volunteer.findById(volunteerId);
  if (!volunteer) throw new Error("Volunteer not found");

  if (volunteer.status === "rejected") {
    throw new Error("Volunteer is already rejected");
  }

  volunteer.status = "rejected";
  volunteer.approvedBy = adminId;
  await volunteer.save();

  // role stays "public" — they were rejected
  return volunteer.populate("user", "name email");
};

// ─── Assign Volunteer to Project ──────────────────────────────────────────────
export const assignVolunteerToProject = async (volunteerId, projectId) => {
  const volunteer = await Volunteer.findById(volunteerId);
  if (!volunteer) throw new Error("Volunteer not found");

  if (volunteer.status !== "approved") {
    throw new Error(
      "Volunteer must be approved before being assigned to a project",
    );
  }

  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");
  if (project.status === "cancelled") {
    throw new Error("Cannot assign volunteer to a cancelled project");
  }

  if (volunteer.assignedProjects.includes(projectId)) {
    throw new Error("Volunteer is already assigned to this project");
  }

  volunteer.assignedProjects.push(projectId);
  await volunteer.save();

  await Project.findByIdAndUpdate(projectId, {
    $addToSet: { volunteers: volunteerId },
  });

  return volunteer.populate([
    { path: "user", select: "name email" },
    { path: "assignedProjects", select: "title status" },
  ]);
};

// ─── Update Volunteer Profile ─────────────────────────────────────────────────
export const updateVolunteer = async (volunteerId, updateData) => {
  const volunteer = await Volunteer.findById(volunteerId);
  if (!volunteer) throw new Error("Volunteer not found");

  // prevent manually changing these through update endpoint
  delete updateData.status;
  delete updateData.approvedBy;
  delete updateData.user;

  const updated = await Volunteer.findByIdAndUpdate(volunteerId, updateData, {
    new: true,
    runValidators: true,
  }).populate("user", "name email");

  return updated;
};

// ─── Remove Volunteer ─────────────────────────────────────────────────────────
export const deleteVolunteer = async (volunteerId) => {
  const volunteer = await Volunteer.findById(volunteerId);
  if (!volunteer) throw new Error("Volunteer not found");

  // remove volunteer from all assigned projects
  if (volunteer.assignedProjects.length > 0) {
    await Project.updateMany(
      { _id: { $in: volunteer.assignedProjects } },
      { $pull: { volunteers: volunteerId } },
    );
  }

  await Volunteer.findByIdAndDelete(volunteerId);

  // revert user role back to public
  await User.findByIdAndUpdate(volunteer.user, { role: "public" });

  return { message: "Volunteer removed successfully" };
};
