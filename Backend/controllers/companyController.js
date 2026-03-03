const Company = require("../models/companyModel");
const User = require("../models/usermodel");
const Job = require("../models/jobModel");

/**
 * Get all companies with pagination
 */
const getAllCompanies = async (req, res) => {
  try {
    const { page = 1, limit = 10, industry, search } = req.query;
    const offset = (page - 1) * limit;

    const whereConditions = {};

    if (industry) {
      whereConditions.industry = industry;
    }

    if (search) {
      const { Op } = require("sequelize");
      whereConditions[Op.or] = [
        { companyName: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const companies = await Company.findAndCountAll({
      where: whereConditions,
      limit: parseInt(limit),
      offset: offset,
      attributes: { exclude: ["userId"] },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      companies: companies.rows,
      total: companies.count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(companies.count / limit),
      message: "Companies fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching companies",
      error: error.message,
    });
  }
};

/**
 * Get a specific company by ID with its jobs
 */
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id, {
      include: [
        {
          model: Job,
          attributes: [
            "id",
            "title",
            "location",
            "jobType",
            "salaryRange",
            "status",
          ],
          limit: 5,
          order: [["createdAt", "DESC"]],
        },
      ],
      attributes: { exclude: ["userId"] },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.json({
      success: true,
      company,
      message: "Company fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching company",
      error: error.message,
    });
  }
};

/**
 * Create a company profile (for company registration)
 */
const createCompany = async (req, res) => {
  try {
    const {
      companyName,
      email,
      description,
      location,
      logo,
      website,
      industry,
      companySize,
    } = req.body;

    // Validation
    if (!companyName || !email) {
      return res.status(400).json({
        success: false,
        message: "Company name and email are required",
      });
    }

    // Check if company already exists
    const existingCompany = await Company.findOne({
      where: { userId: req.user.id },
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "You already have a company profile",
      });
    }

    // Create company
    const company = await Company.create({
      userId: req.user.id,
      companyName,
      email,
      description,
      location,
      logo,
      website,
      industry,
      companySize,
    });

    res.status(201).json({
      success: true,
      company,
      message: "Company profile created successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating company profile",
      error: error.message,
    });
  }
};

/**
 * Update company profile
 */
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // Check if user is the company owner or admin
    if (req.user.id !== company.userId && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "You can only update your own company profile",
      });
    }

    // Update company
    await company.update(updates);

    res.json({
      success: true,
      company,
      message: "Company profile updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating company profile",
      error: error.message,
    });
  }
};

/**
 * Get the current user's company profile
 */
const getMyCompany = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company representatives can access this endpoint",
      });
    }

    const company = await Company.findOne({
      where: { userId: req.user.id },
      include: [
        {
          model: Job,
          attributes: [
            "id",
            "title",
            "location",
            "jobType",
            "status",
            "createdAt",
          ],
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    res.json({
      success: true,
      company,
      message: "Company profile fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching company profile",
      error: error.message,
    });
  }
};

/**
 * Delete a company profile (admin only)
 */
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    // Only admin can delete companies
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete companies",
      });
    }

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    await company.destroy();

    res.json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting company",
      error: error.message,
    });
  }
};

/**
 * Get company statistics (number of jobs, applications)
 */
const getCompanyStats = async (req, res) => {
  try {
    if (req.user.role !== "company") {
      return res.status(403).json({
        success: false,
        message: "Only company representatives can access this endpoint",
      });
    }

    const company = await Company.findOne({
      where: { userId: req.user.id },
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    // Count jobs
    const jobCount = await Job.count({
      where: { companyId: company.id },
    });

    // Count active jobs
    const activeJobCount = await Job.count({
      where: { companyId: company.id, status: "active" },
    });

    // Count total applications
    const Application = require("../models/applicationModel");
    const jobs = await Job.findAll({
      where: { companyId: company.id },
      attributes: ["id"],
      raw: true,
    });

    const jobIds = jobs.map((j) => j.id);
    let totalApplications = 0;

    if (jobIds.length > 0) {
      totalApplications = await Application.count({
        where: { jobId: { [require("sequelize").Op.in]: jobIds } },
      });
    }

    res.json({
      success: true,
      stats: {
        totalJobs: jobCount,
        activeJobs: activeJobCount,
        totalApplications: totalApplications,
      },
      message: "Company statistics fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching company statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  getMyCompany,
  deleteCompany,
  getCompanyStats,
};
