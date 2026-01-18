const Product = require("../models/productModel")

const addProduct = async (req, res) => {
    try{
        const { name, price, description }= req.body;
        if (!name || !price || !description){
            return res.status(400).json({
                message : "All fields are required"
            });
        }
        const newProduct = await Product.create({
            name, price, description
        });

        res.status(201).json({
            message : "product added successfully",
            newProduct
        });
    } catch(error){
        res.status(500).json({
            message: "Error adding product",
            error: error.message
        });
    }
};

module.exports={ addProduct }

