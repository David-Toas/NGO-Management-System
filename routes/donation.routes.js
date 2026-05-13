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
  .get(restrictTo("admin"), getAllDonations)
  .post(restrictTo("admin", "donor"), validateCreateDonation, createDonation);

router.get(
  "/donor/:donorId",
  restrictTo("admin", "donor"),
  validateDonorRouteParam,
  getDonationsByDonor
);

router
  .route("/:id")
  .get(restrictTo("admin", "donor"), validateDonationId, getDonationById)
  .patch(restrictTo("admin"), validateUpdateDonation, updateDonation);

export default router;
