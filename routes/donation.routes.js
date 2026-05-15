import express from "express";
import {
  createDonation,
  getAllDonations,
  getDonationById,
  getDonationsByDonor,
  updateDonation,
} from "../controllers/donation.controller.js";
import protect, { restrictTo } from "../middleware/authMiddleware.js";
import {
  validateCreateDonation,
  validateDonationId,
  validateDonorRouteParam,
  validateUpdateDonation,
} from "../middleware/validateDonors.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo("admin", "staff"), getAllDonations)
  .post(
    restrictTo("admin", "staff", "donor"),
    validateCreateDonation,
    createDonation
  );

router.get(
  "/donor/:donorId",
  restrictTo("admin", "staff", "donor"),
  validateDonorRouteParam,
  getDonationsByDonor
);

router
  .route("/:id")
  .get(
    restrictTo("admin", "staff", "donor"),
    validateDonationId,
    getDonationById
  )
  .patch(
    restrictTo("admin", "staff"),
    validateUpdateDonation,
    updateDonation
  );

export default router;
