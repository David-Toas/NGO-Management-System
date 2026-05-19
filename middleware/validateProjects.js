import { body, param, validationResult } from "express-validator";

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  return next();
};

export const validateCreateProject = [
  body("title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string"),

  body("budget")
    .notEmpty()
    .withMessage("budget is required")
    .isNumeric()
    .withMessage("budget must be a number")
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new Error("budget must be greater than 0");
      }
      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage("description must be a string"),

  body("currency")
    .optional()
    .isString()
    .withMessage("currency must be a string"),

  body("amountReceived")
    .optional()
    .isNumeric()
    .withMessage("amountReceived must be a number")
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error("amountReceived must be a positive number");
      }
      return true;
    }),

  body("amountSpent")
    .optional()
    .isNumeric()
    .withMessage("amountSpent must be a number")
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error("amountSpent must be a positive number");
      }
      return true;
    })
    .custom((value, { req }) => {
      const amountReceived = Number(req.body.amountReceived || 0);
      const amountSpent = Number(value);
      if (amountSpent > amountReceived) {
        throw new Error("amountSpent cannot exceed amountReceived");
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(["planned", "ongoing", "completed", "cancelled"])
    .withMessage(
      "status must be one of: planned, ongoing, completed, cancelled",
    ),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid date"),

  handleValidationErrors,
];

export const validateUpdateProject = [
  param("id").isMongoId().withMessage("Invalid project ID"),

  body("title").optional().isString().withMessage("title must be a string"),

  body("budget")
    .optional()
    .isNumeric()
    .withMessage("budget must be a number")
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new Error("budget must be greater than 0");
      }
      return true;
    }),

  body("description")
    .optional()
    .isString()
    .withMessage("description must be a string"),

  body("currency")
    .optional()
    .isString()
    .withMessage("currency must be a string"),

  body("amountReceived")
    .optional()
    .isNumeric()
    .withMessage("amountReceived must be a number")
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error("amountReceived must be a positive number");
      }
      return true;
    }),

  body("amountSpent")
    .optional()
    .isNumeric()
    .withMessage("amountSpent must be a number")
    .custom((value) => {
      if (Number(value) < 0) {
        throw new Error("amountSpent must be a positive number");
      }
      return true;
    }),

  body("status")
    .optional()
    .isIn(["planned", "ongoing", "completed", "cancelled"])
    .withMessage(
      "status must be one of: planned, ongoing, completed, cancelled",
    ),

  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid date"),

  handleValidationErrors,
];

export const validateProjectId = [
  param("id").isMongoId().withMessage("Invalid project ID"),
  handleValidationErrors,
];
