const express = require('express').Router();
const multer=require("multer");
const upload=multer();
const authGuard = require("../helpers/authguard");

const {
  addUser,
  getAllUsers,
  getUsersById,
  updateUser,
  deleteUser,
  loginUser,
  getMe
} = require("../controllers/userController");

express.post("/register", upload.none(), addUser);
express.get("/getalluser", getAllUsers);
express.get("/getusersbyid/:id", getUsersById);
express.put("/updateuserbyid/:id", updateUser);
express.delete("/deleteuserbyid/:id", deleteUser);
express.post("/loginuser", loginUser);
express.get("/getme", authGuard, getMe)


module.exports=express;
    