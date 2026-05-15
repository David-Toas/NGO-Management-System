import User from "../models/User.js";
import {
  handleChangePassword,
  handleForgotPassword,
  handleLogin,
  handleResetPassword,
} from "../services/auth.service.js";
import {
  sendForgotPasswordMail,
  sendPasswordChangedMail,
  sendWelcomeMail,
} from "../services/mail.service.js";
import generateToken from "../utils/generateToken.js";
import logger from "../utils/logger.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, role });

    try {
      await sendWelcomeMail({
        name: user.name,
        email: user.email,
      });
    } catch (mailError) {
      logger.error("Welcome email failed", {
        userId: user._id.toString(),
        email: user.email,
        errorMessage: mailError.message,
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await handleChangePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    try {
      await sendPasswordChangedMail({
        name: user.name,
        email: user.email,
      });
    } catch (mailError) {
      logger.error("Password change email failed", {
        userId: user._id.toString(),
        email: user.email,
        errorMessage: mailError.message,
      });
    }

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await handleLogin(email, password);
    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    return next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const result = await handleForgotPassword(email);

    if (result) {
      try {
        await sendForgotPasswordMail({
          name: result.user.name,
          email: result.user.email,
          resetToken: result.resetToken,
        });
      } catch (mailError) {
        logger.error("Forgot password email failed", {
          userId: result.user._id.toString(),
          email: result.user.email,
          errorMessage: mailError.message,
        });
      }
    }

    return res.status(200).json({
      message:
        "If an account exists for that email, a password reset link has been sent",
    });
  } catch (err) {
    return next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    const user = await handleResetPassword(token, newPassword);

    try {
      await sendPasswordChangedMail({
        name: user.name,
        email: user.email,
      });
    } catch (mailError) {
      logger.error("Password reset confirmation email failed", {
        userId: user._id.toString(),
        email: user.email,
        errorMessage: mailError.message,
      });
    }

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    return next(err);
  }
};
