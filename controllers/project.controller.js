import Project from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      budget,
      currency,
      amountReceived,
      amountSpent,
      status,
      startDate,
      endDate,
    } = req.body;

    const project = new Project({
      title,
      description,
      budget,
      currency: currency || "NGN",
      amountReceived: amountReceived || 0,
      amountSpent: amountSpent || 0,
      status: status || "planned",
      startDate,
      endDate,
      createdBy: req.user.id,
    });

    await project.save();

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const projects = await Project.find(query)
      .populate("createdBy", "name email role")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Project.countDocuments(query);

    return res.status(200).json({
      success: true,
      message: "Projects retrieved successfully",
      data: projects,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project retrieved successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Validate amountSpent doesn't exceed amountReceived
    if (
      updates.amountSpent !== undefined &&
      updates.amountReceived !== undefined
    ) {
      if (updates.amountSpent > updates.amountReceived) {
        return res.status(400).json({
          success: false,
          message: "amountSpent cannot exceed amountReceived",
        });
      }
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    // Check amounts against existing values if only one is being updated
    if (updates.amountSpent !== undefined && !updates.amountReceived) {
      if (updates.amountSpent > project.amountReceived) {
        return res.status(400).json({
          success: false,
          message: "amountSpent cannot exceed amountReceived",
        });
      }
    }

    if (updates.amountReceived !== undefined && !updates.amountSpent) {
      if (project.amountSpent > updates.amountReceived) {
        return res.status(400).json({
          success: false,
          message: "amountSpent cannot exceed new amountReceived",
        });
      }
    }

    Object.assign(project, updates);
    await project.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
