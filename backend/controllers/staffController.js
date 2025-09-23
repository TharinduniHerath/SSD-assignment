const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Staff = require('../models/staffModel');

// Helper: Validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Fetch all staff members
// @route   GET /api/staffmembers
// @access  Private/Admin
const getStaff = asyncHandler(async (req, res) => {
    const qSearch = req.query.search;
    let staffs;

    if (qSearch) {
        staffs = await Staff.find({ $text: { $search: qSearch } });
    } else {
        staffs = await Staff.find();
    }

    res.status(200).json(staffs.length ? staffs : { message: "No staff members found" });
});

// @desc    Fetch a staff member by ID
// @route   GET /api/staffmembers/:id
// @access  Private
const getStaffById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid staff ID" });

    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff member not found" });

    res.status(200).json(staff);
});

// @desc    Create a staff member
// @route   POST /api/staffmembers
// @access  Private
const addStaff = asyncHandler(async (req, res) => {
    const {
        firstName,
        lastName,
        address,
        nic,
        contactNo,
        dob,
        email,
        department,
        designation,
        joinedDate,
        salary,
        simage
    } = req.body;

    const staff = await Staff.create({
        firstName: firstName?.toString(),
        lastName: lastName?.toString(),
        address: address?.toString(),
        nic: nic?.toString(),
        contactNo: contactNo?.toString(),
        dob: new Date(dob),
        email: email?.toString(),
        department: department?.toString(),
        designation: designation?.toString(),
        joinedDate: new Date(joinedDate),
        salary: Number(salary),
        simage: simage?.toString(),
    });

    res.status(201).json(staff);
});

// @desc    Update a staff member
// @route   PUT /api/staffmembers/:id
// @access  Private
const updateStaff = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid staff ID" });

    const allowedUpdates = {};
    [
        "firstName",
        "lastName",
        "address",
        "nic",
        "contactNo",
        "dob",
        "email",
        "department",
        "designation",
        "joinedDate",
        "salary",
        "simage"
    ].forEach(field => {
        if (req.body[field] !== undefined) allowedUpdates[field] = req.body[field];
    });

    const updatedStaff = await Staff.findByIdAndUpdate(
        id,
        { $set: allowedUpdates },
        { new: true, runValidators: true }
    );

    if (!updatedStaff) return res.status(404).json({ message: "Staff member not found" });

    res.status(200).json(updatedStaff);
});

// @desc    Delete a staff member
// @route   DELETE /api/staffmembers/:id
// @access  Private
const deleteStaff = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid staff ID" });

    const staff = await Staff.findById(id);
    if (!staff) return res.status(404).json({ message: "Staff member not found" });

    await staff.deleteOne();
    res.status(200).json({ message: "Staff member removed successfully" });
});

module.exports = { getStaff, getStaffById, addStaff, updateStaff, deleteStaff };
