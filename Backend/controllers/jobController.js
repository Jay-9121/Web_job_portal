const Job = require("../models/jobModel");
const Company = require("../models/companyModel");
const { Op } = require("sequelize");

/**
 * Get all jobs with optional filtering and searching
 * Query parameters:
 * - search: search by job title or description
 * - location: filter by location
 * - jobType: filter by job type (full-time, part-time, contract, internship, freelance)
 * - experience: filter by experience level
 * - minSalary, maxSalary: filter by salary range
 * - page: pagination page number
 * - limit: number of jobs per page
 */
const getAllJobs = async (req, res) => {
  try {
    const {
      search,
      location,
      jobType,
      experience,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;
    const whereConditions = { status: "active" };

    // Search filter
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Location filter
    if (location) {
      whereConditions.location = { [Op.iLike]: `%${location}%` };
    }

    // Job type filter
    if (jobType) {
      whereConditions.jobType = jobType;
    }

    // Experience level filter
    if (experience) {
      whereConditions.experienceLevel = experience;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      if (minSalary && maxSalary) {
        whereConditions.minSalary = { [Op.gte]: minSalary };
        whereConditions.maxSalary = { [Op.lte]: maxSalary };
      } else if (minSalary) {
        whereConditions.minSalary = { [Op.gte]: minSalary };
      } else if (maxSalary) {
        whereConditions.maxSalary = { [Op.lte]: maxSalary };
      }
    }

    const jobs = await Job.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Company,
          as: "companyDetails",
          attributes: ["id", ["companyName", "name"], "logo", "location", "website"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    res.json({
      success: true,
      jobs: jobs.rows,
      total: jobs.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(jobs.count / limit),
      message: "Jobs fetched successfully",
    });
  } catch (error) {
    console.error("Error in getAllJobs:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: process.env.NODE_ENV === "development" ? error.message : "Internal Server Error",
    });
  }
};

/**
 * Get a single job by ID with company details
 */
const getJobById = async (req, res) => {
  try {
    let { id } = req.params;
    id = parseInt(id, 10);

    // validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findByPk(id, {
      include: [
        {
          model: Company,
          as: "companyDetails",
          attributes: [
            "id",
            ["companyName", "name"], // alias companyName -> name for frontend
            "logo",
            "location",
            "website",
            "description",
          ],
        },
      ],
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.json({
      success: true,
      job,
      message: "Job fetched successfully",
    });
  } catch (error) {
    console.error("Error in getJobById:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching job",
      error: error.message,
    });
  }
};

/**
 * Create a new job (only by company admin)
 * Request body:
 * - title, description, salaryRange, location, jobType, skillsRequired, experienceLevel, vacancies
 */
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      salaryRange,
      minSalary,
      maxSalary,
      location,
      jobType,
      skillsRequired,
      experienceLevel,
      vacancies,
    } = req.body;

    // Validation
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    // Only company users and admins can create jobs
    if (req.user.role !== "company" && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only company representatives and admins can create jobs",
      });
    }

    // Find company associated with this user (optional for admins)
    let company = null;
    if (req.user.role === "company") {
      company = await Company.findOne({
        where: { userId: req.user.id },
      });

      if (!company) {
        return res.status(400).json({
          success: false,
          message: "Company profile not found for this user",
        });
      }
    }

    const newJob = await Job.create({
      title,
      description,
      salaryRange,
      minSalary: parseInt(minSalary) || null,
      maxSalary: parseInt(maxSalary) || null,
      location,
      jobType: jobType || "full-time",
      skillsRequired: Array.isArray(skillsRequired) ? skillsRequired : [],
      experienceLevel,
      vacancies: parseInt(vacancies) || 1,
      // if a company user is creating the job, associate it; admins can leave it null
      companyId: company ? company.id : null,
      createdBy: req.user.id,
      status: "active",
    });

    res.status(201).json({
      success: true,
      job: newJob,
      message: "Job created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating job",
      error: error.message,
    });
  }
};

/**
 * Update a job (only by company that created it)
 */
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const job = await Job.findByPk(id);

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
        message: "Only company representatives can update jobs",
      });
    }

    const company = await Company.findOne({
      where: { userId: req.user.id },
    });

    if (!company || job.companyId !== company.id) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own jobs",
      });
    }

    // Update job
    await job.update(updates);

    res.json({
      success: true,
      job,
      message: "Job updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating job",
      error: error.message,
    });
  }
};

/**
 * Delete a job (only by company that created it)
 */
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

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
        message: "Only company representatives can delete jobs",
      });
    }

    const company = await Company.findOne({
      where: { userId: req.user.id },
    });

    if (!company || job.companyId !== company.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own jobs",
      });
    }

    await job.destroy();

    res.json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting job",
      error: error.message,
    });
  }
};

/**
 * Close a job posting
 */
const closeJob = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findByPk(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check permissions
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company representatives can close jobs",
      });
    }

    const company = await Company.findOne({
      where: { userId: req.user.id },
    });

    if (!company || job.companyId !== company.id) {
      return res.status(403).json({
        success: false,
        message: "You can only close your own jobs",
      });
    }

    await job.update({ status: "closed" });

    res.json({
      success: true,
      job,
      message: "Job closed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error closing job",
      error: error.message,
    });
  }
};

/**
 * Get jobs posted by a specific company
 */
const getJobsByCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const jobs = await Job.findAndCountAll({
      where: { companyId },
      limit: parseInt(limit),
      offset: offset,
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      jobs: jobs.rows,
      total: jobs.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(jobs.count / limit),
      message: "Company jobs fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching company jobs",
      error: error.message,
    });
  }
};

/**
 * Search jobs by title, description, location, etc
 */
const searchJobs = async (req, res) => {
  try {
    const {
      query,
      location,
      jobType,
      experience,
      minSalary,
      maxSalary,
      page = 1,
      limit = 10,
    } = req.query;

    if (!query && !location && !jobType && !experience) {
      return res.status(400).json({
        success: false,
        message: "Please provide at least one search parameter",
      });
    }

    const offset = (page - 1) * limit;
    const whereConditions = { status: "active" };

    if (query) {
      whereConditions[Op.or] = [
        { title: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
      ];
    }

    if (location) {
      whereConditions.location = { [Op.iLike]: `%${location}%` };
    }

    if (jobType) {
      whereConditions.jobType = jobType;
    }

    if (experience) {
      whereConditions.experienceLevel = experience;
    }

    if (minSalary || maxSalary) {
      if (minSalary && maxSalary) {
        whereConditions.minSalary = { [Op.gte]: minSalary };
        whereConditions.maxSalary = { [Op.lte]: maxSalary };
      } else if (minSalary) {
        whereConditions.minSalary = { [Op.gte]: minSalary };
      } else if (maxSalary) {
        whereConditions.maxSalary = { [Op.lte]: maxSalary };
      }
    }

    const jobs = await Job.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Company,
          as: "companyDetails",
          attributes: ["id", ["companyName", "name"], "logo", "location", "website"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: offset,
    });

    res.json({
      success: true,
      jobs: jobs.rows,
      total: jobs.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(jobs.count / limit),
      message: "Search results",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching jobs",
      error: error.message,
    });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  closeJob,
  getJobsByCompany,
  searchJobs,
};
