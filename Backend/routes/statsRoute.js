const express = require("express");
const router = express.Router();
const authGuard = require("../helpers/authguagrd");
const isAdmin = require("../helpers/isAdmin");
const {
  getPublicStats,
  getDashboardStats,
  getUserApplications,
  getAllApplications,
  saveJob,
  removeSavedJob,
  getSavedJobs
} = require("../controllers/statsController");

// Public routes
router.get("/", getPublicStats);

// Admin routes
router.get("/dashboard", authGuard, isAdmin, getDashboardStats);

// Authenticated user routes
router.get("/my-applications", authGuard, getUserApplications);
router.get("/saved-jobs", authGuard, getSavedJobs);
router.post("/save-job", authGuard, saveJob);
router.delete("/saved-jobs/:jobId", authGuard, removeSavedJob);

// Admin only routes
router.get("/all-applications", authGuard, isAdmin, getAllApplications);

module.exports = router;

