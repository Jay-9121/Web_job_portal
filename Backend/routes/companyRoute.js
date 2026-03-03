const express = require("express");
const router = express.Router();
const authGuard = require("../helpers/authguagrd");
const isAdmin = require("../helpers/isAdmin");
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  getMyCompany,
  deleteCompany,
  approveCompany,
  rejectCompany,
  getCompanyStats,
} = require("../controllers/companyController");

/**
 * Public routes
 */
// Get all companies
router.get("/", getAllCompanies);

// Get a specific company by ID
router.get("/:id", getCompanyById);

/**
 * Company-only routes
 */
// Create a company profile
router.post("/", authGuard, createCompany);

// Get current user's company profile
router.get("/profile/me", authGuard, getMyCompany);

// Get company statistics
router.get("/stats/overview", authGuard, getCompanyStats);

// Update company profile
router.put("/:id", authGuard, updateCompany);

/**
 * Admin routes
 */
// Delete a company (admin only)
router.delete("/:id", authGuard, isAdmin, deleteCompany);

// Approve a company (admin only)
router.patch("/:id/approve", authGuard, isAdmin, approveCompany);

// Reject a company (admin only)
router.patch("/:id/reject", authGuard, isAdmin, rejectCompany);

module.exports = router;
