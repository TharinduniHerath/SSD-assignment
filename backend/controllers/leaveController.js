const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Leave = require('../models/leaveModel');

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Fetch all leaves (with optional search)
// @route   GET /api/leaves
// @access  Private/Admin
const getLeave = asyncHandler(async (req, res) => {
    const qSearch = req.query.search ? req.query.search.toString() : null;

    let leaves;
    if (qSearch) {
        leaves = await Leave.find({
            $text: { $search: qSearch }
        });
    } else {
        leaves = await Leave.find();
    }

    res.status(200).json(leaves);
});

// @desc    Fetch a single leave by ID
// @route   GET /api/leaves/:id
// @access  Private
const getLeaveById = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
        return res.status(404).json({ message: 'Leave member not found' });
    }

    res.status(200).json(leave);
});

// @desc    Create a leave
// @route   POST /api/leaves
// @access  Private
const addLeave = asyncHandler(async (req, res) => {
    const { staffId, leaveType, reason, leaveFrom, leaveTo } = req.body;

    if (!staffId || !leaveType || !leaveFrom || !leaveTo) {
        return res.status(400).json({ message: "Required fields are missing" });
    }

    const leave = new Leave({
        staffId: staffId.toString(),
        leaveType: leaveType.toString(),
        reason: reason ? reason.toString() : "",
        leaveFrom: leaveFrom.toString(),
        leaveTo: leaveTo.toString(),
    });

    const savedLeave = await leave.save();
    res.status(201).json(savedLeave);
});

// @desc    Update leave
// @route   PUT /api/leaves/:id
// @access  Private
const updateLeave = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
        return res.status(404).json({ message: 'Leave member not found' });
    }

    const allowedUpdates = {};
    ["staffId", "leaveType", "reason", "leaveFrom", "leaveTo"].forEach(field => {
        if (req.body[field] !== undefined) {
            allowedUpdates[field] = req.body[field].toString();
        }
    });

    const updatedLeave = await Leave.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true });
    res.status(200).json(updatedLeave);
});

// @desc    Delete leave
// @route   DELETE /api/leaves/:id
// @access  Private
const deleteLeave = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const leave = await Leave.findById(id);
    if (!leave) {
        return res.status(404).json({ message: 'Leave member not found' });
    }

    await leave.deleteOne();
    res.status(200).json({ message: 'Leave member removed' });
});

module.exports = { getLeave, getLeaveById, addLeave, updateLeave, deleteLeave };
