import bcrypt from 'bcrypt';

import User from "../models/User";

export const handleChangePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch) throw new Error("Current password is incorrect");

  user.password = await bcrypt.hash(newPassword, 12);

  await user.save();
};