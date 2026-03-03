const express = require("express");
const router = express.Router();
const authGuard = require("../helpers/authguagrd");
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  closeJob,
  getJobsByCompany,
  searchJobs,
} = require("../controllers/jobController");

/**
 * Public routes
 */
// Get all jobs with optional filters
router.get("/", getAllJobs);

// Search jobs
router.get("/search", searchJobs);

// Get a specific job by ID
router.get("/:id", getJobById);

/**
 * Company-only routes
 */
// Create a new job (authenticated, company only)
router.post("/", authGuard, createJob);

// Update a job
router.put("/:id", authGuard, updateJob);

// Delete a job
router.delete("/:id", authGuard, deleteJob);

// Close a job posting
router.patch("/:id/close", authGuard, closeJob);

/**
 * Company jobs routes
 */
// Get all jobs by a specific company
router.get("/company/:companyId", getJobsByCompany);

module.exports = router;
