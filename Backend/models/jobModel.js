const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

/**
 * Job Model for Job Portal
 *
 * Represents job postings created by companies.
 * Each job belongs to a company and can have multiple applications.
 *
 * Relationships:
 * - Job belongsTo Company (each job is posted by one company)
 * - Job hasMany Applications (one job can have many applicants)
 *
 * Database Normalization:
 * - Foreign key: companyId references Companies table
 * - Proper indexing on frequently queried fields (location, jobType)
 */
const Job = sequelize.define(
  "Job",
  {
    // Job title - required field for job identification
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      comment:
        "Job position title (e.g., Software Engineer, Marketing Manager)",
    },
    // Detailed job description
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment:
        "Full job description including responsibilities and requirements",
    },
    // Salary range - stored as string for flexibility (e.g., "50k-80k" or "50000-80000")
    salaryRange: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Salary range (e.g., "$50,000 - $80,000")',
    },
    // Minimum salary for numerical filtering
    minSalary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Minimum salary for filtering",
    },
    // Maximum salary for numerical filtering
    maxSalary: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Maximum salary for filtering",
    },
    // Job location - city or remote
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'Job location (city, or "Remote")',
    },
    // Job type - full-time, part-time, contract, internship
    jobType: {
      type: DataTypes.ENUM(
        "full-time",
        "part-time",
        "contract",
        "internship",
        "freelance",
      ),
      allowNull: false,
      defaultValue: "full-time",
      comment: "Type of employment",
    },
    // Required skills - stored as JSON array
    skillsRequired: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment:
        'Array of required skills (e.g., ["JavaScript", "React", "Node.js"])',
    },
    // Experience level required
    experienceLevel: {
      type: DataTypes.ENUM("entry", "mid", "senior", "lead", "executive"),
      allowNull: true,
      comment: "Required experience level",
    },
    // Company that posted the job - foreign key
    // nullable in case an admin manually creates a job without an associated company
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Foreign key to Company table (nullable for admin jobs)",
    },
    // Job status - active, closed, draft
    status: {
      type: DataTypes.ENUM("active", "closed", "draft"),
      allowNull: false,
      defaultValue: "active",
      comment: "Job posting status",
    },
    // Number of available positions
    vacancies: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 1,
      comment: "Number of open positions",
    },
    // Application deadline
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Last date to apply for this job",
    },
    // Job category/field
    category: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Job category (Engineering, Marketing, Sales, etc.)",
    },
  },
  {
    timestamps: true,
    tableName: "jobs",
    comment: "Jobs table - stores job postings from companies",
  },
);

module.exports = Job;
