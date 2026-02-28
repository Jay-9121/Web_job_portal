const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const RestaurantCuisine = sequelize.define("RestaurantCuisine", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  cuisineId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = RestaurantCuisine;
