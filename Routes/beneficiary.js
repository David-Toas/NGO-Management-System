import express from "express";
import {
  createBeneficiary,
  getAllBeneficiaries,
  getBeneficiaryById,
  updateBeneficiary,
  deleteBeneficiary,
} from "../controllers/beneficiary.js";

// import { protect, restrictTo } from "../middlewares/auth.middleware.js";

const router = express.Router();

router
  .route("/")
  .get(
    // protect,
    // restrictTo("admin", "staff"),
    getAllBeneficiaries,
  )
  .post(
    // protect,
    // restrictTo("admin", "staff"),
    createBeneficiary,
  );

router
  .route("/:id")
  .get(
    // protect,
    // restrictTo("admin", "staff"),
    getBeneficiaryById,
  )
  .patch(
    // protect,
    // restrictTo("admin", "staff"),
    updateBeneficiary,
  )
  .delete(
    // protect,
    // restrictTo("admin"),
    deleteBeneficiary,
  );

export default router;
