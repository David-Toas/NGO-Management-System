import { body, validationResult } from "express-validator";

export const validateChangePassword = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters")
    .matches(/[A-Za-z]/)
    .withMessage("New password must contain a letter")
    .matches(/[0-9]/)
    .withMessage("New password must contain a number"),

  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    return next();
  },
];
