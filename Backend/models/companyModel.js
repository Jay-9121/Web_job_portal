const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

/**
 * Company Model for Job Portal
 *
 * Represents companies/employers who post jobs on the platform.
 * This model stores company information including name, description, location, and logo.
 *
 * Relationships:
 * - One Company hasMany Jobs (company can post multiple jobs)
 * - One Company hasOne User (company representative account)
 */
const Company = sequelize.define(
  "Company",
  {
    // Company representative (links to User model)
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      comment:
        "Foreign key to User table - links company to its representative account",
    },
    // Company name - required field for identification
    companyName: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Official company name",
    },
    // Company email - for contact purposes
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Company contact email",
    },
    // Company description - overview of the company
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "Company description and overview",
    },
    // Company location - city/address
    location: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Company location (city, address)",
    },
    // Company logo URL - for display purposes
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "URL to company logo image",
    },
    // Company website URL
    website: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Company website URL",
    },
    // Industry type
    industry: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Industry sector (IT, Healthcare, Finance, etc.)",
    },
    // Company size - number of employees
    companySize: {
      type: DataTypes.ENUM("1-10", "11-50", "51-200", "201-500", "500+"),
      allowNull: true,
      comment: "Number of employees in the company",
    },
  },
  {
    timestamps: true,
    tableName: "companies",
    comment:
      "Companies table - stores employer/company information for job postings",
  },
);

module.exports = Company;
