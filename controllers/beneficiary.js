import * as beneficiaryService from "../services/beneficiary.js";

// ─── Register Beneficiary ─────────────────────────────────────────────────────
export const createBeneficiary = async (req, res) => {
  try {
    const beneficiary = await beneficiaryService.createBeneficiary(
      req.body,
      req.user?._id, // staffId from auth middleware
    );

    res.status(201).json({
      success: true,
      message: "Beneficiary registered successfully",
      data: beneficiary,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Get All Beneficiaries ────────────────────────────────────────────────────
export const getAllBeneficiaries = async (req, res) => {
  try {
    const { page, limit, gender, isActive, projectId } = req.query;

    const result = await beneficiaryService.getAllBeneficiaries({
      page,
      limit,
      gender,
      isActive,
      projectId,
    });

    res.status(200).json({
      success: true,
      message: "Beneficiaries retrieved successfully",
      data: result.beneficiaries,
      pagination: result.pagination,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── Get Single Beneficiary ───────────────────────────────────────────────────
export const getBeneficiaryById = async (req, res) => {
  try {
    const beneficiary = await beneficiaryService.getBeneficiaryById(
      req.params.id,
    );

    res.status(200).json({
      success: true,
      message: "Beneficiary retrieved successfully",
      data: beneficiary,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

// ─── Update Beneficiary ───────────────────────────────────────────────────────
export const updateBeneficiary = async (req, res) => {
  try {
    const beneficiary = await beneficiaryService.updateBeneficiary(
      req.params.id,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Beneficiary updated successfully",
      data: beneficiary,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ─── Soft Delete Beneficiary ──────────────────────────────────────────────────
export const deleteBeneficiary = async (req, res) => {
  try {
    const result = await beneficiaryService.deleteBeneficiary(req.params.id);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
