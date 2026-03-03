const Application = require("../models/applicationModel");
const Job = require("../models/jobModel");
const User = require("../models/usermodel");
const Company = require("../models/companyModel");
const { Op } = require("sequelize");

/**
 * Submit a job application
 * Request body: jobId, coverLetter (optional), skills (array), experience (array)
 * Request file: cv (optional) - CV/Resume file (PDF, DOC, DOCX)
 */
const submitApplication = async (req, res) => {
  try {
    // Handle both JSON and multipart/form-data
    let { jobId, coverLetter, skills, experience } = req.body;
    const userId = req.user.id;

    // Ensure jobId is parsed as integer
    jobId = parseInt(jobId, 10);

    // Validation
    if (!jobId || isNaN(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Valid Job ID is required",
      });
    }

    // Check if user is a job seeker
    if (req.user.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only job seekers can apply for jobs",
      });
    }

    // Check if job exists
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if job is active
    if (job.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "This job is no longer accepting applications",
      });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      where: { userId, jobId },
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    // Handle CV file upload
    let resumePath = null;
    if (req.file) {
      // Store the relative path for serving
      resumePath = `/uploads/cv/${req.file.filename}`;
    }

    // Parse skills and experience from JSON string if coming from FormData
    let parsedSkills = [];
    let parsedExperience = [];
    
    try {
      parsedSkills = skills && typeof skills === 'string' ? JSON.parse(skills) : (Array.isArray(skills) ? skills : []);
      parsedExperience = experience && typeof experience === 'string' ? JSON.parse(experience) : (Array.isArray(experience) ? experience : []);
    } catch (parseError) {
      console.error('Error parsing skills/experience:', parseError);
    }

    // Create application
    const application = await Application.create({
      userId,
      jobId,
      coverLetter: coverLetter || null,
      resume: resumePath, // Store CV file path
      skills: Array.isArray(parsedSkills) ? parsedSkills.filter(s => s && s.trim()) : [],
      experience: Array.isArray(parsedExperience) ? parsedExperience.filter(exp => exp.position || exp.company) : [],
      status: "applied",
    });

    res.status(201).json({
      success: true,
      application,
      message: "Application submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error submitting application",
      error: error.message,
    });
  }
};

/**
 * Get all applications for a specific job (for company)
 */
const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Verify job exists and user is the company that posted it
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user is company and owns this job
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company representatives can view applications",
      });
    }

    const company = await Company.findOne({
      where: { userId: req.user.id },
    });

    if (!company || job.companyId !== company.id) {
      return res.status(403).json({
        success: false,
        message: "You can only view applications for your own jobs",
      });
    }

    const offset = (page - 1) * limit;
    const whereConditions = { jobId };

    if (status) {
      whereConditions.status = status;
    }

    const applications = await Application.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "applicant",
          attributes: ["id", "username", "email", "phoneNumber", "location"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    res.json({
      success: true,
      applications: applications.rows,
      total: applications.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(applications.count / limit),
      message: "Applications fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching applications",
      error: error.message,
    });
  }
};

/**
 * Get all applications by a specific user
 */
const getApplicationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    // Verify user owns this application history or is admin
    if (req.user.id !== parseInt(userId) && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only view your own applications",
      });
    }

    const offset = (page - 1) * limit;
    const whereConditions = { userId };

    if (status) {
      whereConditions.status = status;
    }

    const applications = await Application.findAndCountAll({
      where: whereConditions,
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
          ],
          include: [
            {
              model: Company,
              as: "companyDetails",
              attributes: ["id", ["companyName", "name"], "logo"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    res.json({
      success: true,
      applications: applications.rows,
      total: applications.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(applications.count / limit),
      message: "User applications fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user applications",
      error: error.message,
    });
  }
};

/**
 * Get a specific application by ID
 */
const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id, {
      include: [
        {
          model: User,
          as: "applicant",
          attributes: ["id", "username", "email", "phoneNumber", "location"],
        },
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
          ],
          include: [
            {
              model: Company,
              as: "companyDetails",
              attributes: ["id", "name", "logo"],
            },
          ],
        },
      ],
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Verify user has permission to view this application
    if (
      req.user.id !== application.userId &&
      req.user.role !== "admin" &&
      req.user.role !== "company"
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to view this application",
      });
    }

    res.json({
      success: true,
      application,
      message: "Application fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching application",
      error: error.message,
    });
  }
};

/**
 * Update application status (for company or admin)
 * Statuses: applied, shortlisted, rejected, accepted, withdrawn
 */
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = [
      "applied",
      "shortlisted",
      "rejected",
      "accepted",
      "withdrawn",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid statuses: ${validStatuses.join(", ")}`,
      });
    }

    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check if user is admin - admin can update any application status
    if (req.user.role === "admin") {
      await application.update({ status });
      return res.json({
        success: true,
        application,
        message: "Application status updated successfully by admin",
      });
    }

    // Check if user is company and owns this job
    const job = await Job.findByPk(application.jobId);
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company representatives or admins can update application status",
      });
    }

    const company = await Company.findOne({
      where: { userId: req.user.id },
    });

    if (!company || job.companyId !== company.id) {
      return res.status(403).json({
        success: false,
        message:
          "You can only update applications for your own jobs",
      });
    }

    await application.update({ status });

    res.json({
      success: true,
      application,
      message: "Application status updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating application status",
      error: error.message,
    });
  }
};

/**
 * Withdraw an application (by job seeker)
 */
const withdrawApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Verify user owns this application
    if (req.user.id !== application.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only withdraw your own applications",
      });
    }

    // Check if application can be withdrawn
    if (["rejected", "accepted", "withdrawn"].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot withdraw application with status: ${application.status}`,
      });
    }

    await application.update({ status: "withdrawn" });

    res.json({
      success: true,
      application,
      message: "Application withdrawn successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error withdrawing application",
      error: error.message,
    });
  }
};

/**
 * Delete an application (admin only or by job seeker if not yet reviewed)
 */
const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // Check permissions
    if (
      req.user.id !== application.userId &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to delete this application",
      });
    }

    await application.destroy();

    res.json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting application",
      error: error.message,
    });
  }
};

/**
 * Get application statistics for a company
 */
const getApplicationStats = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company representatives can view statistics",
      });
    }

    const company = await Company.findOne({
      where: { userId: req.user.id },
    });

    if (!company) {
      return res.status(400).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // Get company jobs
    const jobs = await Job.findAll({
      where: { companyId: company.id },
      attributes: ["id"],
      raw: true,
    });

    const jobIds = jobs.map((j) => j.id);

    if (jobIds.length === 0) {
      return res.json({
        success: true,
        stats: {
          total: 0,
          applied: 0,
          shortlisted: 0,
          rejected: 0,
          accepted: 0,
          withdrawn: 0,
        },
        message: "No applications yet",
      });
    }

    // Get statistics
    const stats = await Application.findAll({
      where: { jobId: { [Op.in]: jobIds } },
      attributes: [
        "status",
        [require("sequelize").fn("COUNT", require("sequelize").col("id")), "count"],
      ],
      group: ["status"],
      raw: true,
    });

    const statObj = {
      total: 0,
      applied: 0,
      shortlisted: 0,
      rejected: 0,
      accepted: 0,
      withdrawn: 0,
    };

    stats.forEach((stat) => {
      statObj[stat.status] = parseInt(stat.count);
      statObj.total += parseInt(stat.count);
    });

    res.json({
      success: true,
      stats: statObj,
      message: "Application statistics fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message,
    });
  }
};

module.exports = {
  submitApplication,
  getApplicationsByJob,
  getApplicationsByUser,
  getApplicationById,
  updateApplicationStatus,
  withdrawApplication,
  deleteApplication,
  getApplicationStats,
};
