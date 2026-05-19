import express from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from "../controllers/event.controller.js";
import protect, { restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getAllEvents)
  .post(restrictTo("admin"), createEvent);

router
  .route("/:id")
  .get(getEventById)
  .put(restrictTo("admin"), updateEvent)
  .delete(restrictTo("admin"), deleteEvent);

export default router;
