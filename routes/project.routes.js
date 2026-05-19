import express from "express";

import {
  createProject,
  deleteProject,
  getAllProjects,
  getProjectById,
  updateProject,
} from "../controllers/project.controller.js";

import protect, {
  restrictTo,
} from "../middleware/authMiddleware.js";

import {
  validateCreateProject,
  validateProjectId,
  validateUpdateProject,
} from "../middleware/validateProjects.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(getAllProjects)
  .post(
    restrictTo("admin", "staff"),
    validateCreateProject,
    createProject
  );

router
  .route("/:id")
  .get(validateProjectId, getProjectById)
  .patch(
    restrictTo("admin", "staff"),
    validateUpdateProject,
    updateProject
  )
  .delete(
    restrictTo("admin"),
    validateProjectId,
    deleteProject
  );

export default router;