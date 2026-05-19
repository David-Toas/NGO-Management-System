import Event from "../models/Event.js";

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate("organizer", "name email role")
      .populate("project", "title status")
      .sort({ date: 1 });

    return res.status(200).json({
      success: true,
      message: "Events retrieved successfully",
      data: events,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name email role")
      .populate("project", "title status")
      .populate("attendees", "name email");

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Event retrieved successfully",
      data: event,
    });
  } catch (error) {
    return res.status(error.statusCode || 404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully",
      data: event,
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res
        .status(404)
        .json({ success: false, message: "Event not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 400).json({
      success: false,
      message: error.message,
    });
  }
};
