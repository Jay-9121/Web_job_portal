const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc    Register a new user
// @route   POST /api/user/register
const addUser = async (req, res) => {
    console.log("Registration Attempt:", req.body);
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check if username or email already exists
        const isUser = await User.findOne({ where: { username } });
        const isEmail = await User.findOne({ where: { email } });

        if (isUser || isEmail) {
            return res.status(400).json({ 
                success: false, 
                message: "Username or Email already exists!" 
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user - 'role' will default to 'user' via the Model/Database
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: 'user' 
        });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: { id: newUser.id, username: newUser.username, email: newUser.email }
        });

    } catch (error) {
        console.error("AddUser Error:", error);
        return res.status(500).json({
            success: false,
            message: "Error adding user",
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/user/login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found!!" });
        }

        // Compare the plain text password with the hashed password in DB
        const isvalidUser = await bcrypt.compare(password, user.password);
        if (!isvalidUser) {
            return res.status(400).json({ success: false, message: "Invalid email or password!!" });
        }

        // Create token containing both ID and ROLE
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(200).json({
            success: true,
            message: "User logged in successfully!!",
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role // This allows React to see if you are 'admin' or 'user'
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/user/getme
const getMe = async (req, res) => {
    try {
        const id = req.user.id; 
        const user = await User.findByPk(id, {
            attributes: { exclude: ["password"] }
        });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ 
            success: true, 
            user, 
            message: "User profile fetched successfully" 
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching profile",
            error: error.message,
        });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ["password"] } });
        return res.json({ success: true, users, message: "Users fetched successfully" });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error.message,
        });
    }
};

const getUsersById = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id, { attributes: { exclude: ["password"] } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        return res.json({
            success: true,
            user,
            message: "User fetched successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching user",
            error: error.message,
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { username, email, password } = req.body;
        
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (username) {
            const isexistinguser = await User.findOne({ where: { username } });
            if (isexistinguser && isexistinguser.id !== user.id) {
                return res.status(400).json({
                    success: false,
                    message: "User with that username exists!",
                });
            }
        }

        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await user.update({
            username: username || user.username,
            email: email || user.email,
            password: hashedPassword,
        });

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: { id: user.id, username: user.username }
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating user",
            error: error.message,
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        await user.destroy();
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting user",
            error: error.message,
        });
    }
};

module.exports = {
    addUser, 
    getAllUsers, 
    updateUser, 
    deleteUser, 
    getUsersById, 
    loginUser, 
    getMe
};