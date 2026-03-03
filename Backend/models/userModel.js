const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

// Define the User model for the Job Portal system
// This model represents users who can be job seekers, company representatives, or admins
const User = sequelize.define(
  "User",
  {
    // Username / display name - required field for identification
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Unique username or display name of the user",
    },
    // Email address - must be unique for authentication and communication
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "Unique email address for user login and notifications",
    },
    // Password hash - stored securely for authentication
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Hashed password for secure authentication",
    },
    // Additional profile fields
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "User phone number",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "User location",
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Short bio or description for the user",
    },
    // User role - determines access level and permissions
    role: {
      type: DataTypes.ENUM("user", "admin", "company"),
      allowNull: false,
      defaultValue: "user",
      comment:
        "User role: user (job seeker), admin (platform admin), company (employer)",
    },
    // Skills array - list of technical/professional skills
    skills: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of user skills for job matching",
    },
    // Years of experience - numerical value for filtering
    experience: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: "Years of professional experience",
    },
    // Saved jobs - array of job IDs that user has bookmarked
    savedJobs: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
      comment: "Array of job IDs saved by the user",
    },
    // CV/Resume file path
    cvPath: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Path to user's uploaded CV/Resume file",
    },
    // Profile picture file path
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Path to user's profile picture",
    },
    // Fields used for password reset flow
    resetPasswordToken: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Hashed OTP/token for password reset",
    },
    resetPasswordExpires: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "Expiration timestamp for the reset token",
    },
  },
  {
    // Enable automatic timestamps (createdAt, updatedAt)
    timestamps: true,
    // Table name in database
    tableName: "users",
    // Additional comments for documentation
    comment:
      "Users table for Job Portal - stores job seekers, companies, and admins",
  },
);

module.exports = User;
