const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const { generateToken } = require('../utils/generateToken');

// Helper function to validate email
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const email = req.body.email?.toString().trim();
    const password = req.body.password?.toString();

    if (!email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    if (!validateEmail(email)) {
        res.status(400);
        throw new Error('Invalid email format');
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const username = req.body.username?.toString().trim();
    const email = req.body.email?.toString().trim();
    const password = req.body.password?.toString();

    if (!username || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    if (!validateEmail(email)) {
        res.status(400);
        throw new Error('Invalid email format');
    }

    if (password.length < 6) {
        res.status(400);
        throw new Error('Password must be at least 6 characters');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const user = new User({ username, email, password });
    const savedUser = await user.save();

    res.status(201).json({
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        isAdmin: savedUser.isAdmin,
        token: generateToken(savedUser._id),
    });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.username = req.body.username ? req.body.username.toString().trim() : user.username;
    user.email = req.body.email ? req.body.email.toString().trim() : user.email;
    if (req.body.password) user.password = req.body.password.toString();

    if (req.body.email && !validateEmail(user.email)) {
        res.status(400);
        throw new Error('Invalid email format');
    }

    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser._id),
    });
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.status(200).json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid user ID');
    }

    const user = await User.findById(id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User removed' });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid user ID');
    }

    const user = await User.findById(id).select('-password');
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.status(200).json(user);
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid user ID');
    }

    const user = await User.findById(id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.username = req.body.username ? req.body.username.toString().trim() : user.username;
    user.email = req.body.email ? req.body.email.toString().trim() : user.email;
    user.isAdmin = typeof req.body.isAdmin === 'boolean' ? req.body.isAdmin : user.isAdmin;

    if (req.body.email && !validateEmail(user.email)) {
        res.status(400);
        throw new Error('Invalid email format');
    }

    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
    });
});

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

    const data = await User.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        { $project: { month: { $month: '$createdAt' } } },
        { $group: { _id: '$month', total: { $sum: 1 } } },
    ]);

    res.status(200).json(data);
});

module.exports = {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers,
    deleteUser,
    getUserById,
    updateUser,
    getUserStats,
};
