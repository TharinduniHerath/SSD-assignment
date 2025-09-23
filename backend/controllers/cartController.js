const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const Cart = require('../models/cartModel');

// Helper to validate ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Fetch all carts
// @route   GET /api/carts
// @access  Private/Admin
const getCarts = asyncHandler(async (req, res) => {
    const carts = await Cart.find();
    res.status(200).json(carts);
});

// @desc    Fetch logged in user cart
// @route   GET /api/carts/:userId
// @access  Private
const getMyCart = asyncHandler(async (req, res) => {
    if (!validateObjectId(req.params.userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }

    const cart = await Cart.findOne({ userId: req.params.userId });

    if (cart) {
        res.status(200).json(cart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
});

// @desc    Create cart
// @route   POST /api/carts
// @access  Private
const createCart = asyncHandler(async (req, res) => {
    const { products } = req.body;

    const cart = new Cart({
        user: req.user._id,
        products: Array.isArray(products) ? products : [], // sanitize input
    });

    const savedCart = await cart.save();
    res.status(200).json(savedCart);
});

// @desc    Update cart
// @route   PUT /api/carts/:id
// @access  Private
const updateCart = asyncHandler(async (req, res) => {
    if (!validateObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid cart ID' });
    }

    const cart = await Cart.findById(req.params.id);

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    // Only allow updating products array
    const sanitizedBody = {};
    if (req.body.products) sanitizedBody.products = Array.isArray(req.body.products) ? req.body.products : cart.products;

    const updatedCart = await Cart.findByIdAndUpdate(req.params.id, { $set: sanitizedBody }, { new: true });
    res.status(200).json(updatedCart);
});

// @desc    Delete cart
// @route   DELETE /api/carts/:id
// @access  Private
const deleteCart = asyncHandler(async (req, res) => {
    if (!validateObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid cart ID' });
    }

    const cart = await Cart.findById(req.params.id);

    if (!cart) {
        res.status(404);
        throw new Error('Cart not found');
    }

    await cart.deleteOne();
    res.status(200).json({ message: 'Cart removed' });
});

module.exports = { getCarts, getMyCart, createCart, updateCart, deleteCart };
