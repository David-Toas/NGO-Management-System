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

export const validateCreateDonor = [
  body("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isMongoId()
    .withMessage("userId must be a valid ID"),

  body("donorType")
    .optional()
    .isIn(["individual", "organization"])
    .withMessage("donorType must be either individual or organization"),

  body("organizationName")
    .if(body("donorType").equals("organization"))
    .notEmpty()
    .withMessage("organizationName is required for organization donors"),

  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  handleValidationErrors,
];

export const validateDonorId = [
  param("id").isMongoId().withMessage("Invalid donor ID"),
  handleValidationErrors,
];

export const validateUpdateDonor = [
  param("id").isMongoId().withMessage("Invalid donor ID"),

  body("donorType")
    .optional()
    .isIn(["individual", "organization"])
    .withMessage("donorType must be either individual or organization"),

  body("organizationName")
    .optional()
    .isString()
    .withMessage("organizationName must be a string"),

  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("address")
    .optional()
    .isString()
    .withMessage("address must be a string"),

  handleValidationErrors,
];

export const validateCreateDonation = [
  body("donorId")
    .optional()
    .isMongoId()
    .withMessage("donorId must be a valid ID"),

  body("userId")
    .optional()
    .isMongoId()
    .withMessage("userId must be a valid ID"),

  body("amount")
    .notEmpty()
    .withMessage("amount is required")
    .isNumeric()
    .withMessage("amount must be a number")
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new Error("amount must be greater than 0");
      }

      return true;
    }),

  body("projectId")
    .optional({ nullable: true, checkFalsy: true })
    .isMongoId()
    .withMessage("projectId must be a valid ID"),

  body("donationType")
    .optional()
    .isIn(["cash", "kind", "transfer"])
    .withMessage("donationType must be cash, kind, or transfer"),

  body("currency")
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage("currency must be a 3-letter code e.g. NGN"),

  handleValidationErrors,
];

export const validateDonationId = [
  param("id").isMongoId().withMessage("Invalid donation ID"),
  handleValidationErrors,
];

export const validateDonorRouteParam = [
  param("donorId").isMongoId().withMessage("Invalid donor ID"),
  handleValidationErrors,
];

export const validateUpdateDonation = [
  param("id").isMongoId().withMessage("Invalid donation ID"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "failed"])
    .withMessage("status must be pending, confirmed, or failed"),

  body("notes")
    .optional()
    .isString()
    .withMessage("notes must be a string"),

  handleValidationErrors,
];
