import bcrypt from "bcrypt";
import crypto from "crypto";

import User from "../models/User.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const hashResetToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const upgradeLegacyRole = async (user) => {
  if (user?.role === "beneficiary") {
    user.role = "public";
    await user.save();
  }

  return user;
};

export const handleLogin = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw createError("Invalid email or password", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw createError("Invalid email or password", 401);
  }

  return upgradeLegacyRole(user);
};

export const handleForgotPassword = async (email) => {
  const user = await User.findOne({ email }).select(
    "+passwordResetToken +passwordResetExpires"
  );

  if (!user) {
    return null;
  }

  await upgradeLegacyRole(user);

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = hashResetToken(resetToken);
  user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  return {
    user,
    resetToken,
  };
};

export const handleResetPassword = async (token, newPassword) => {
  const hashedToken = hashResetToken(token);

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select("+password +passwordResetToken +passwordResetExpires");

  if (!user) {
    throw createError("Invalid or expired reset token", 400);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
};

export const handleChangePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw createError("User not found", 404);
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    throw createError("Current password is incorrect", 400);
  }

  user.password = newPassword;
  await user.save();

  return user;
};
