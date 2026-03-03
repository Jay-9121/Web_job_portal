const User = require("../models/usermodel");
const Company = require("../models/companyModel");
const Job = require("../models/jobModel");
const Application = require("../models/applicationModel");

/**
 * Get public portal statistics (for home page)
 * No authentication required
 * Returns: active jobs, job seekers, companies
 */
const getPublicStats = async (req, res) => {
  try {
    const activeJobs = await Job.count({ where: { status: "active" } });
    const jobSeekers = await User.count({ where: { role: "user" } });
    const companies = await User.count({ 
      where: { role: ["admin", "company"] } 
    });

    res.json({
      success: true,
      data: {
        activeJobs,
        jobSeekers,
        companies
      },
      message: "Platform statistics fetched successfully"
    });
  } catch (error) {
    console.error("Error in getPublicStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching platform statistics",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error"
    });
  }
};

/**
 * Get dashboard statistics (admin only)
 * Returns: total users, active jobs, companies, applications
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const activeJobs = await Job.count({ where: { status: "active" } });
    const totalCompanies = await Company.count();
    const totalApplications = await Application.count();

    // Get recent stats (we use "applied" as the initial application state)
    const appliedApplications = await Application.count({
      where: { status: "applied" }
    });

    const acceptedApplications = await Application.count({
      where: { status: "accepted" }
    });

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeJobs,
        totalCompanies,
        totalApplications,
        appliedApplications,
        acceptedApplications
      },
      message: "Dashboard stats fetched successfully"
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard stats",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error"
    });
  }
};

/**
 * Get user's own applications
 */
const getUserApplications = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const applications = await Application.findAll({
      where: { userId },
      include: [
        {
          model: Job,
          as: "jobDetails",
          attributes: [
            "id",
            "title",
            "description",
            "location",
            "jobType",
            "salaryRange",
            "experienceLevel"
          ],
          include: [
            {
              model: Company,
              as: "companyDetails",
              attributes: ["id", ["companyName", "name"], "logo", "location"]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    res.json({
      success: true,
      applications,
      count: applications.length,
      message: "User applications fetched successfully"
    });
  } catch (error) {
    console.error("Error in getUserApplications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user applications",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error"
    });
  }
};

/**
 * Get all applications for admin view
 */
const getAllApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const applications = await Application.findAndCountAll({
      include: [
        {
          model: Job,
          as: "jobDetails",
          attributes: [
            "id",
            "title",
            "description",
            "location",
            "jobType",
            "salaryRange"
          ],
          include: [
            {
              model: Company,
              as: "companyDetails",
              attributes: ["id", ["companyName", "name"], "logo"]
            }
          ]
        },
        {
          model: User,
          as: "applicant",
          attributes: ["id", "username", "email", "phoneNumber"]
        }
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset
    });

    res.json({
      success: true,
      applications: applications.rows,
      total: applications.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(applications.count / limit),
      message: "All applications fetched successfully"
    });
  } catch (error) {
    console.error("Error in getAllApplications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching applications",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error"
    });
  }
};

/**
 * Save a job for the user
 */
const saveJob = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.body;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Job ID are required"
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Initialize savedJobs if not already an array
    let savedJobs = Array.isArray(user.savedJobs) ? user.savedJobs : [];

    // Add job ID if not already saved
    if (!savedJobs.includes(jobId)) {
      savedJobs.push(jobId);
      await user.update({ savedJobs });
    }

    res.json({
      success: true,
      message: "Job saved successfully",
      savedJobs
    });
  } catch (error) {
    console.error("Error in saveJob:", error);
    res.status(500).json({
      success: false,
      message: "Error saving job",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error"
    });
  }
};

/**
 * Remove a saved job for the user
 */
const removeSavedJob = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { jobId } = req.params;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "User ID and Job ID are required"
      });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Initialize savedJobs if not already an array
    let savedJobs = Array.isArray(user.savedJobs) ? user.savedJobs : [];

    // Remove job ID
    savedJobs = savedJobs.filter(id => id !== parseInt(jobId));
    await user.update({ savedJobs });

    res.json({
      success: true,
      message: "Job removed from saved",
      savedJobs
    });
  } catch (error) {
    console.error("Error in removeSavedJob:", error);
    res.status(500).json({
      success: false,
      message: "Error removing saved job",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error"
    });
  }
};

/**
 * Get user's saved jobs
 */
const getSavedJobs = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const savedJobIds = Array.isArray(user.savedJobs) ? user.savedJobs : [];

    if (savedJobIds.length === 0) {
      return res.json({
        success: true,
        jobs: [],
        count: 0,
        message: "No saved jobs found"
      });
    }

    const jobs = await Job.findAll({
      where: { id: savedJobIds },
      include: [
        {
          model: Company,
          as: "companyDetails",
          attributes: ["id", ["companyName", "name"], "logo", "location"]
        }
      ]
    });

    res.json({
      success: true,
      jobs,
      count: jobs.length,
      message: "Saved jobs fetched successfully"
    });
  } catch (error) {
    console.error("Error in getSavedJobs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching saved jobs",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error"
    });
  }
};

module.exports = {
  getPublicStats,
  getDashboardStats,
  getUserApplications,
  getAllApplications,
  saveJob,
  removeSavedJob,
  getSavedJobs
};
