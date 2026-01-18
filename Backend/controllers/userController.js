const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const addUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }
    const isUser = await User.findOne({ where: { username } });
    const isemail = await User.findOne({ where: { email } });
    if (isUser || isemail) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const hassed = await bcrypt.hash(password, 10);
    console.log(hassed);

    const newUser = await User.create({
      username,
      email,
      password: hassed,
    });

    res.status(201).json({
      success: true,
      message: "User added successfully",
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding user",
      error: error.message,
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ["password"] } });
    res.status(200).json({ message: "Users retrieved successfully", users });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id
    const users = await User.findByPk(id)
    if(!users){
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.json({
      user: { id: users.id, name: users.username },
      message: "Users retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving users",
      error: error.message,
    });
  }
};

const updateUser=async(req,res)=>{
    try{
        const {id}=req.params;
        const {username,email,password}=req.body;
        const user=await User.findByPk(id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        if (username) {
            const existingUser = await User.findOne({ where: { username } });
            if (existingUser && existingUser.id !== user.id) {
                return res.status(400).json({ 
                    message: "Username already taken",})
            }
        }
        let hassedPassword=user.password;
        if(password){
            hassedPassword=await bcrypt.hash(password,10);
        }
        await user.update({
            username : username || user.username,
            email : email || user.email,
            password:hassedPassword

        });
        res.json({message:"User updated successfully",user});
    }catch(error){
        return res.status(500).json ({
            message : "error updating user",
            error : error.message,
        });
    }
}

const getActiveUsers = async (req, res) => {
  res.json({ message: "Get active users - to be implemented" });
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await user.destroy();

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,    
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    return res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
        
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
};




module.exports = { addUser, getAllUsers, getActiveUsers, getUserById , updateUser, deleteUser, loginUser};