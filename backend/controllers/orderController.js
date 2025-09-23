const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Order = require('../models/orderModel');

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
    const { orderItems, amount, address, status } = req.body;

    if (!orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
        user: req.user._id,
        orderItems,
        amount,
        address: address.toString(),
        status: status.toString(),
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const order = await Order.findById(id).populate('user', 'username email');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    res.status(200).json(order);
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const allowedUpdates = {};
    ['status', 'amount', 'address'].forEach((field) => {
        if (req.body[field] !== undefined) {
            allowedUpdates[field] = req.body[field].toString();
        }
    });

    const updatedOrder = await Order.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true });
    res.status(200).json(updatedOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.status(200).json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
    const qSearch = req.query.search ? req.query.search.toString() : null;
    let orders;

    if (qSearch) {
        orders = await Order.find({ $text: { $search: qSearch } }).populate('user', 'id username');
    } else {
        orders = await Order.find({}).populate('user', 'id username');
    }

    res.status(200).json(orders);
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    await order.deleteOne();
    res.status(200).json({ message: 'Order removed' });
});

// @desc    Get monthly income
// @route   GET /api/orders/insights/monthlyIncome
// @access  Private/Admin
const getMonthlyIncome = asyncHandler(async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    const income = await Order.aggregate([
        { $match: { createdAt: { $gte: previousMonth } } },
        { $project: { month: { $month: '$createdAt' }, sales: '$total' } },
        { $group: { _id: '$month', total: { $sum: '$sales' } } },
    ]);

    res.status(200).json(income);
});

// @desc    Get yearly income
// @route   GET /api/orders/insights/yearlyIncome
// @access  Private/Admin
const getYearlyIncome = asyncHandler(async (req, res) => {
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentDate = new Date();
    const currentYearStart = new Date(currentDate.getFullYear(), 0, 1);

    const income = await Order.aggregate([
        { $match: { createdAt: { $gte: currentYearStart } } },
        { $project: { month: { $month: '$createdAt' }, sales: '$total' } },
        { $group: { _id: '$month', Income: { $sum: '$sales' } } },
        { $addFields: { name: { $arrayElemAt: [monthNames, { $subtract: ['$_id', 1] }] } } },
        { $sort: { _id: 1 } },
    ]);

    res.status(200).json(income);
});

// @desc    Get daily order count for last month
// @route   GET /api/orders/insights/dailyOrderCount
// @access  Private/Admin
const getDailyOrderCount = asyncHandler(async (req, res) => {
    const oneMonthAgoStartDate = new Date();
    oneMonthAgoStartDate.setMonth(oneMonthAgoStartDate.getMonth() - 1);

    const orderCount = await Order.aggregate([
        { $match: { createdAt: { $gte: oneMonthAgoStartDate } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, Orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
    ]);

    const currentDate = new Date();
    const dates = [];
    for (let date = oneMonthAgoStartDate; date <= currentDate; date.setDate(date.getDate() + 1)) {
        dates.push(new Date(date));
    }

    const updatedOrderCount = dates.map((date) => {
        const formattedDate = date.toISOString().split('T')[0];
        const matchingOrder = orderCount.find((order) => order._id === formattedDate);
        return matchingOrder || { _id: formattedDate, Orders: 0, name: date.getDate() };
    });

    res.status(200).json(updatedOrderCount);
});

// @desc    Get total order stats
// @route   GET /api/orders/insights/totalOrderCount
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res) => {
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalAmount = orders.reduce((acc, order) => acc + order.total, 0);
    res.status(200).json({ totalOrders, totalAmount });
});

// @desc    Get product income by ID
// @route   GET /api/orders/insights/productIncome/:id
// @access  Private/Admin
const getProductIncome = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid Product ID' });

    const productId = new mongoose.Types.ObjectId(id);
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const currentDate = new Date();
    const currentYearStart = new Date(currentDate.getFullYear(), 0, 1);

    const income = await Order.aggregate([
        { $unwind: '$orderItems' },
        { $match: { createdAt: { $gte: currentYearStart }, 'orderItems.productId': productId } },
        { $project: { month: { $month: '$createdAt' }, sales: '$orderItems.productTotal' } },
        { $group: { _id: '$month', Income: { $sum: '$sales' } } },
        { $addFields: { name: { $arrayElemAt: [monthNames, { $subtract: ['$_id', 1] }] } } },
        { $sort: { _id: 1 } },
    ]);

    res.status(200).json(income);
});

module.exports = {
    createOrder,
    getOrderById,
    updateOrder,
    getMyOrders,
    getOrders,
    deleteOrder,
    getMonthlyIncome,
    getYearlyIncome,
    getDailyOrderCount,
    getOrderStats,
    getProductIncome,
};
