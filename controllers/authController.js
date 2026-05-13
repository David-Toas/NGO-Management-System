import User from "../models/User.js";
import { handleChangePassword } from "../services/auth.service.js";
import generateToken from "../utils/generateToken.js";

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password, role });

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

    await handleChangePassword(req.user.id, currentPassword, newPassword);

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return next(err);
  }
};
