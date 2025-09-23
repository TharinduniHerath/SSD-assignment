const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const Order = require("../models/orderModel");

// Helper to validate ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper to sanitize user input to prevent NoSQL injection
const sanitizeInput = (value) => {
    if (typeof value === "string") {
        return value.replace(/\$/g, "").replace(/\./g, ""); // remove $ and .
    }
    return value;
};

// @desc    Retrieve all orders
// @route   GET /api/orders
// @access  Private/Admin
const retrieveOrders = asyncHandler(async (req, res) => {
    // If you want to allow filtering by query params, sanitize them first
    const query = {};
    if (req.query.status) query.status = sanitizeInput(req.query.status);

    const orders = await Order.find(query).sort({ createdAt: -1 });
    res.status(200).json(orders);
});

// @desc    Retrieve specific order by custom orderId
// @route   GET /api/orders/:id
// @access  Private/Admin
const retrieveSpecificOrder = asyncHandler(async (req, res) => {
    const orderID = sanitizeInput(req.params.id.toString());

    const selectedOrder = await Order.find({ orderId: orderID });

    if (selectedOrder.length !== 0) {
        res.status(200).json(selectedOrder);
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

// @desc    Retrieve specific order by MongoDB ObjectId
// @route   GET /api/orders/mongo/:id
// @access  Private/Admin
const retrieveSpecificOrderUsinMongo = asyncHandler(async (req, res) => {
    const orderID = req.params.id;

    if (!validateObjectId(orderID)) {
        return res.status(400).json({ message: "Invalid order ID" });
    }

    const selectedOrder = await Order.findById(orderID);

    if (selectedOrder) {
        res.status(200).json(selectedOrder);
    } else {
        res.status(404).json({ message: "Order not found" });
    }
});

// @desc    Update an order
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = asyncHandler(async (req, res) => {
    const orderID = req.params.id;

    if (!validateObjectId(orderID)) {
        return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(orderID);
    if (!order) {
        res.status(404);
        throw new Error("Order not found");
    }

    // Only allow updating specific fields, sanitize inputs
    const allowedUpdates = {};
    if (req.body.status) allowedUpdates.status = sanitizeInput(req.body.status);
    if (req.body.products) allowedUpdates.products = req.body.products; // array, sanitize elements if necessary
    if (req.body.total) allowedUpdates.total = req.body.total;

    const updatedOrder = await Order.findByIdAndUpdate(
        orderID,
        { $set: allowedUpdates },
        { new: true }
    );

    res.status(200).json(updatedOrder);
});

module.exports = {
    retrieveOrders,
    retrieveSpecificOrder,
    retrieveSpecificOrderUsinMongo,
    updateOrder,
};
