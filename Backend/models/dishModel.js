const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");

const Dish = sequelize.define("Dish", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  image: {
    type: DataTypes.STRING,
  },
  restaurantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Dish;
