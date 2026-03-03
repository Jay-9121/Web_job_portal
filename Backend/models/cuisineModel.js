const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

// Simple Cuisine model to support restaurant/venue features
// This model is referenced by venueController and in the REST APIs.
const Cuisine = sequelize.define(
  "Cuisine",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      comment: "Name of the cuisine (e.g., Italian, Chinese)"
    },
  },
  {
    timestamps: true,
    tableName: "cuisines",
    comment:
      "Cuisine table used for categorizing restaurants/venues by food type",
  }
);

module.exports = Cuisine;
