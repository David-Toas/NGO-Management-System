import express from "express";
import {
  changePassword,
  register,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import { validateRegister } from "../middleware/validateRegister.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.put("/change-password", protect, changePassword);

export default router;
