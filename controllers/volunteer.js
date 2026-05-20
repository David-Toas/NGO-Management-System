import * as volunteerService from "../services/volunteer.js";

// ─── Register as Volunteer ────────────────────────────────────────────────────
export const createVolunteer = async (req, res) => {
  try {
    const volunteer = await volunteerService.createVolunteer({
      userId: req.body.userId,
      skills: req.body.skills,
      availability: req.body.availability,
    });

    res.status(201).json({
      success: true,
      message: "Volunteer application submitted, pending admin approval",
      data: volunteer,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Get All Volunteers ───────────────────────────────────────────────────────
export const getAllVolunteers = async (req, res) => {
  try {
    const { page, limit, status, availability } = req.query;

    const result = await volunteerService.getAllVolunteers({
      page,
      limit,
      status,
      availability,
    });

    res.status(200).json({
      success: true,
      message: "Volunteers retrieved successfully",
      data: result.volunteers,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Single Volunteer ─────────────────────────────────────────────────────
export const getVolunteerById = async (req, res) => {
  try {
    const volunteer = await volunteerService.getVolunteerById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Volunteer retrieved successfully",
      data: volunteer,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ─── Approve Volunteer ────────────────────────────────────────────────────────
export const approveVolunteer = async (req, res) => {
  try {
    const volunteer = await volunteerService.approveVolunteer(
      req.params.id,
      req.user._id, // comes from auth middleware
    );

    res.status(200).json({
      success: true,
      message: "Volunteer approved successfully",
      data: volunteer,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Reject Volunteer ─────────────────────────────────────────────────────────
export const rejectVolunteer = async (req, res) => {
  try {
    const volunteer = await volunteerService.rejectVolunteer(
      req.params.id,
      req.user._id, // comes from auth middleware
    );

    res.status(200).json({
      success: true,
      message: "Volunteer rejected",
      data: volunteer,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Assign Volunteer to Project ──────────────────────────────────────────────
export const assignVolunteerToProject = async (req, res) => {
  try {
    const volunteer = await volunteerService.assignVolunteerToProject(
      req.params.id,
      req.body.projectId,
    );

    res.status(200).json({
      success: true,
      message: "Volunteer assigned to project successfully",
      data: volunteer,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Update Volunteer ─────────────────────────────────────────────────────────
export const updateVolunteer = async (req, res) => {
  try {
    const volunteer = await volunteerService.updateVolunteer(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      data: volunteer,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Delete Volunteer ─────────────────────────────────────────────────────────
export const deleteVolunteer = async (req, res) => {
  try {
    const result = await volunteerService.deleteVolunteer(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
