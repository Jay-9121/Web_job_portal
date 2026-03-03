const { Sequelize } = require("sequelize");
const path = require("path");

// Load dotenv with explicit path to .env file in Backend folder
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

// Validate required environment variables
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;

console.log("Loading database config from:", path.resolve(__dirname, "..", ".env"));
console.log("DB_NAME:", dbName);
console.log("DB_USER:", dbUser);

if (!dbName || !dbUser || !dbPass || !dbHost) {
  console.error("Missing required database configuration:");
  if (!dbName) console.error("  - DB_NAME is not set in .env");
  if (!dbUser) console.error("  - DB_USER is not set in .env");
  if (!dbPass) console.error("  - DB_PASS is not set in .env");
  if (!dbHost) console.error("  - DB_HOST is not set in .env");
  process.exit(1);
}

const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: "postgres",
  logging: false,
  port: process.env.DB_PORT || 5432,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
