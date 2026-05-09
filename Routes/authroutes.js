import express from "express";

const router = express.Router();

import authController from "../controllers/authController";

import protect from "../middleware/authMiddleware";

router.put("/change-password", protect, authController.changePassword);

export default router;