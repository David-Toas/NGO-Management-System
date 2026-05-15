import express from "express";
import {
  changePassword,
  forgotPassword,
  login,
  register,
  resetPassword,
} from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";
import {
  validateForgotPassword,
  validateLogin,
  validateResetPassword,
} from "../middleware/validateAuth.js";
import { validateChangePassword } from "../middleware/validateChangePassword.js";
import { validateRegister } from "../middleware/validateRegister.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/forgot-password", validateForgotPassword, forgotPassword);
router.post("/reset-password", validateResetPassword, resetPassword);
router.put(
  "/change-password",
  protect,
  validateChangePassword,
  changePassword
);

export default router;
