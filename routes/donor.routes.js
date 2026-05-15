import express from "express";
import {
  createDonor,
  deactivateDonor,
  getAllDonors,
  getDonorById,
  reactivateDonor,
  updateDonor,
} from "../controllers/donor.controller.js";
import protect, { restrictTo } from "../middleware/authMiddleware.js";
import {
  validateCreateDonor,
  validateDonorId,
  validateUpdateDonor,
} from "../middleware/validateDonors.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(restrictTo("admin", "staff"), getAllDonors)
  .post(
    restrictTo("admin", "staff", "donor", "public"),
    validateCreateDonor,
    createDonor
  );

router
  .route("/:id")
  .get(restrictTo("admin", "staff", "donor"), validateDonorId, getDonorById)
  .patch(
    restrictTo("admin", "staff", "donor"),
    validateUpdateDonor,
    updateDonor
  );

router.patch(
  "/:id/deactivate",
  restrictTo("donor"),
  validateDonorId,
  deactivateDonor
);

router.patch(
  "/:id/reactivate",
  restrictTo("admin", "staff"),
  validateDonorId,
  reactivateDonor
);

export default router;
