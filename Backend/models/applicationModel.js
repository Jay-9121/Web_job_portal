const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

/**
 * Application Model for Job Portal
 *
 * Represents job applications from users to jobs.
 * This model tracks the entire application process with status management.
 *
 * Relationships:
 * - Application belongsTo User (one user can submit many applications)
 * - Application belongsTo Job (each application is for one job)
 *
 * Database Design:
 * - Composite unique constraint on (userId, jobId) to prevent duplicate applications
 * - Foreign keys with ON DELETE CASCADE for data integrity
 * - Status enum for application tracking
 */
const Application = sequelize.define(
  "Application",
  {
    // User who applied - foreign key
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Foreign key to User table - applicant",
    },
    // Job applied for - foreign key
    jobId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Foreign key to Job table - job position applied for",
    },
    // Resume URL - optional file upload
    resume: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL to uploaded resume file",
    },
    // Cover letter - optional text
    coverLetter: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Applicant cover letter",
    },
    // Application status - tracks the application lifecycle
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected", "withdrawn"),
      allowNull: false,
      defaultValue: "pending",
      comment: "Application status: pending, accepted, rejected, or withdrawn",
    },
    // Additional notes from employer
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Internal notes from employer/recruiter",
    },
    // Interview date - scheduled interview
    interviewDate: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Scheduled interview date and time",
    },
    // Applicant's phone number
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Applicant contact phone number",
    },
    // LinkedIn profile URL
    linkedIn: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Applicant LinkedIn profile URL",
    },
    // Portfolio/GitHub URL
    portfolio: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Applicant portfolio or GitHub URL",
    },
  },
  {
    timestamps: true,
    tableName: "applications",
    comment: "Applications table - tracks job applications from users",
    // Ensure one user can only apply once per job
    indexes: [
      {
        unique: true,
        fields: ["userId", "jobId"],
        name: "unique_user_job_application",
      },
    ],
  },
);

module.exports = Application;
