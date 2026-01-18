const {DataTypes}=require("sequelize");
const { sequelize } = require ("../database/database")

const Product = sequelize.define(
    "Product",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement : true,
            primaryKey: true,
        },
        name:{
            type: DataTypes.STRING,
            allowNull:false,
            unique:true,
        },
        price:{
            type: DataTypes.DECIMAL(10,2),
            allowNull:false,
        },
        description:{
            type: DataTypes.TEXT,
            allowNull:false,
        },
           
    },
    {
        tableName:"products",
        timestamps:true,
    }
);

module.exports=Product;
