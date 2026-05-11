import express from "express";
import bcrypt from "bcrypt";

import authService from "../service/authservice";

const changePassword = async (req, res) => {
  try {
    await authService.handleChangePassword(
      req.user.id,
      req.body.currentPassword,
      req.body.newPassword
    );

    res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export { changePassword };