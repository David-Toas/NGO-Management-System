import express from "express";
import {
  createVolunteer,
  getAllVolunteers,
  getVolunteerById,
  approveVolunteer,
  rejectVolunteer,
  assignVolunteerToProject,
  updateVolunteer,
  deleteVolunteer,
} from "../controllers/volunteer.js";

const router = express.Router();

router
  .route("/")
  .get(
    // protect,
    // restrictTo("admin", "staff"),
    getAllVolunteers,
  )
  .post(
    // protect,
    // restrictTo("admin", "staff"),
    createVolunteer,
  );

router
  .route("/:id")
  .get(
    // protect,
    // restrictTo("admin", "staff"),
    getVolunteerById,
  )
  .patch(
    // protect,
    // restrictTo("admin", "staff"),
    updateVolunteer,
  )
  .delete(
    // protect,
    // restrictTo("admin"),
    deleteVolunteer,
  );

// approve a volunteer — admin only
router.patch(
  "/:id/approve",
  // protect,
  // restrictTo("admin"),
  approveVolunteer,
);

// reject a volunteer — admin only
router.patch(
  "/:id/reject",
  // protect,
  // restrictTo("admin"),
  rejectVolunteer,
);

// assign volunteer to a project — admin/staff
router.patch(
  "/:id/assign",
  // protect,
  // restrictTo("admin", "staff"),
  assignVolunteerToProject,
);

export default router;
