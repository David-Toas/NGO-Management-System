import { body, validationResult } from "express-validator";

const passwordRules = (fieldName, label) =>
  body(fieldName)
    .notEmpty()
    .withMessage(`${label} is required`)
    .isLength({ min: 8 })
    .withMessage(`${label} must be at least 8 characters`)
    .matches(/[A-Za-z]/)
    .withMessage(`${label} must contain a letter`)
    .matches(/[0-9]/)
    .withMessage(`${label} must contain a number`);

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }

  return next();
};

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
  handleValidationErrors,
];

export const validateForgotPassword = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email")
    .normalizeEmail(),
  handleValidationErrors,
];

export const validateResetPassword = [
  body("token").trim().notEmpty().withMessage("Reset token is required"),
  passwordRules("newPassword", "New password"),
  handleValidationErrors,
];
