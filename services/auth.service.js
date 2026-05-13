import bcrypt from "bcrypt";

import User from "../models/User.js";

export const handleChangePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) {
    const error = new Error("Current password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  await user.save();
};
