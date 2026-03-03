require("dotenv").config();
const express = require("express");
const { sequelize, connectDB } = require("./database/db");
const path = require("path");
const app = express();
const port = 3000;

const cors = require("cors");
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ============== MODEL ASSOCIATIONS ==============
// Import models
const User = require("./models/usermodel");
const Company = require("./models/companyModel");
const Job = require("./models/jobModel");
const Application = require("./models/applicationModel");
const Restaurant = require("./models/venueModel");
const Cuisine = require("./models/cuisineModel");
const RestaurantCuisine = require("./models/restaurantCuisineModel");

// Define associations
// User - Application (One-to-Many)
User.hasMany(Application, { foreignKey: "userId", as: "applications" });
Application.belongsTo(User, {
  foreignKey: "userId",
  as: "applicant",
  onDelete: "CASCADE",
});

// Job - Application (One-to-Many)
Job.hasMany(Application, { foreignKey: "jobId", as: "applications" });
Application.belongsTo(Job, {
  foreignKey: "jobId",
  as: "jobDetails",
  onDelete: "CASCADE",
});

// Company - Job (One-to-Many)
Company.hasMany(Job, { foreignKey: "companyId", as: "jobs" });
Job.belongsTo(Company, {
  foreignKey: "companyId",
  as: "companyDetails",
  onDelete: "CASCADE",
});

// Restaurant - Cuisine (Many-to-Many through RestaurantCuisine)
Restaurant.belongsToMany(Cuisine, {
  through: RestaurantCuisine,
  foreignKey: "restaurantId",
  as: "cuisines",
});

Cuisine.belongsToMany(Restaurant, {
  through: RestaurantCuisine,
  foreignKey: "cuisineId",
  as: "restaurants",
});
// =================================================

app.use("/api/user/", require("./routes/route"));
// app.use("/api", require("./routes/venueRoute"));
// Admin settings routes
app.use("/api/admin", require("./routes/settingsRoute"));

// Cuisine routes
// app.use("/api/cuisine", require("./routes/cuisineRoute"));

// Dish routes
// app.use("/api/dishes", require("./routes/dishRoute"));

// ============== JOB PORTAL ROUTES ==============
// Job routes
app.use("/api/jobs", require("./routes/jobRoute"));

// Application routes
app.use("/api/applications", require("./routes/applicationRoute"));

// Company routes
app.use("/api/companies", require("./routes/companyRoute"));

// Stats/Dashboard routes
app.use("/api/stats", require("./routes/statsRoute"));
// ==============================================

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Job Portal API",
  });
});

// ============== GLOBAL ERROR HANDLING MIDDLEWARE ==============
/**
 * 404 Not Found handler
 */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
    method: req.method,
  });
});

/**
 * Global error handler middleware
 * Catches all errors thrown in async middleware and route handlers
 */
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV !== "production";

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(isDevelopment && { stack: err.stack, fullError: err }),
  });
});
// ==============================================

const startServer = async () => {
  await connectDB();
  // by default do not modify existing tables on restart. Altering during
  // sync can sometimes generate invalid SQL (Postgres doesn't allow adding
  // UNIQUE inline) so we only enable it when the developer explicitly asks
  // for it via DB_ALTER_SYNC=true. For destructive updates use
  // DB_FORCE_SYNC=true which drops/recreates all tables.
  const syncOptions = {};
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.DB_ALTER_SYNC === "true"
  ) {
    syncOptions.alter = true;
    console.log("🔧 Running sequelize.sync({ alter: true })");
  }
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.DB_FORCE_SYNC === "true"
  ) {
    syncOptions.force = true;
    console.log("⚠️ Forcing database sync (tables will be dropped)");
  }
  await sequelize.sync(syncOptions);

  // Development convenience: auto-create an admin if none exists
  if (process.env.NODE_ENV !== "production") {
    try {
      const bcrypt = require("bcrypt");
      const adminEmail = process.env.ADMIN_EMAIL || "admin@local.test";
      const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
      const adminName = process.env.ADMIN_NAME || "Administrator";

      const existingAdmin = await User.findOne({ where: { role: "admin" } });
      if (!existingAdmin) {
        const hashed = await bcrypt.hash(adminPassword, 10);
        await User.create({
          username: adminName,
          email: adminEmail,
          password: hashed,
          role: "admin",
        });
        console.log(
          `Created admin user: ${adminEmail} (password: ${adminPassword})`,
        );
      } else {
        console.log(`Admin user exists: ${existingAdmin.email}`);
      }
    } catch (err) {
      console.warn("Admin seeding failed:", err.message || err);
    }
  }

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
