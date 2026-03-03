const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

// Booking Model (used by the legacy restaurant/venue booking system)
// This model wasn't present originally which caused the "MODULE_NOT_FOUND"
// error seen when starting the server.  Including it restores the ability
// to create and query bookings and keeps the backend compatible with the
// existing frontend code (examples: createBooking, getUserBookings, etc.).

const Booking = sequelize.define(
  "Booking",
  {
    // ID columns are auto-added by Sequelize when `timestamps: true` is
    // enabled.

    // Restaurant or venue being booked (foreign key if restaurants table
    // existed).  Required field used throughout the controller.
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Identifier for the restaurant/venue being booked",
    },

    // The user who made the booking.  Stored as an integer to match the
    // users table (via `userId`) but not enforced as a foreign key here.
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "ID of the user who placed the booking",
    },

    // A textual username to ease display (fallback when the user no longer
    // exists or the name is required without a join).
    userName: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Cached user name for easier display",
    },

    // Date of the reservation (only the date portion is relevant).
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Date of the booking",
    },

    // Time slot chosen by the user (stored as string so it can include
    // formats like "6:30 PM" or "18:30").
    time: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: "Time slot for the reservation",
    },

    // Current status of the booking, used by admin endpoints to confirm
    // / cancel and by dashboard statistics.
    status: {
      type: DataTypes.ENUM("Pending", "Confirmed", "Cancelled"),
      allowNull: false,
      defaultValue: "Pending",
      comment: "Booking status",
    },

    // Price charged for the reservation.  Controller expects this to be a
    // string so the dashboard can `replace(/[^
    // \d]/g, "")` when calculating revenue.
    price: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Recorded price for the booking (may include currency symbol)",
    },

    // Arbitrary extra details that may be submitted by the frontend in
    // the body (e.g. party size, special requests). Keeping as JSON for
    // flexibility.
    details: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: "Additional booking metadata as JSON",
    },
  },
  {
    timestamps: true,
    tableName: "bookings",
    comment: "Reservations made by users for restaurants/venues",
  },
);

module.exports = Booking;
