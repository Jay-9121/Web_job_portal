const express = require('express').Router();
const multer=require("multer");
const upload=multer();

const {
  addUser,
  getAllUsers,
  getUsersById,
  updateUser,
  deleteUser,
  loginUser
} = require("../controllers/userController");

express.post("/user", upload.none(), addUser);
express.get("/getalluser", getAllUsers);
express.get("/getusersbyid/:id", getUsersById);
express.put("/updateuserbyid/:id", updateUser);
express.delete("/deleteuserbyid/:id", deleteUser);
express.post("/loginuser", loginUser);


module.exports=express;