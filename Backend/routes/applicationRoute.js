const express = require("express");
const router = express.Router();
const authGuard = require("../helpers/authguagrd");
const { handleCVUpload } = require("../helpers/cvUpload");
const {
  submitApplication,
  getApplicationsByJob,
  getApplicationsByUser,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  deleteApplication,
  getApplicationStats,
} = require("../controllers/applicationController");

/**
 * User (job seeker) routes
 */
// Submit a job application - with CV upload support
router.post("/submit", authGuard, handleCVUpload, submitApplication);

// Get user's applications
router.get("/user/:userId", authGuard, getApplicationsByUser);

// Withdraw an application
router.patch("/:id/withdraw", authGuard, withdrawApplication);

/**
 * Company routes
 */
// Get all applications for a job
router.get("/job/:jobId", authGuard, getApplicationsByJob);

// Update application status
router.patch("/:id/status", authGuard, updateApplicationStatus);

// Get application statistics
router.get("/stats/overview", authGuard, getApplicationStats);

/**
 * General routes
 */
// Get a specific application
router.get("/:id", authGuard, getApplicationById);

// Delete an application
router.delete("/:id", authGuard, deleteApplication);

module.exports = router;
