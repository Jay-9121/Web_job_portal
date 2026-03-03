const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

// Join table representing many-to-many relationship between
// restaurants/venues and cuisines.
const RestaurantCuisine = sequelize.define(
  "RestaurantCuisine",
  {
    restaurantId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Foreign key to venue/restaurant table",
    },
    cuisineId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Foreign key to cuisine table",
    },
  },
  {
    timestamps: false,
    tableName: "restaurant_cuisines",
    comment:
      "Join table linking restaurants/venues with their available cuisines",
  }
);

module.exports = RestaurantCuisine;
