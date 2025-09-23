const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ReleaseItem = require("../models/releaseItemModel");

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get a single release record by releaseRecord field
// @route   GET /api/release/:id
// @access  Private/Admin
const getSingleReleaseRecord = asyncHandler(async (req, res) => {
    const relRecord = req.params.id?.toString();
    if (!relRecord) return res.status(400).json({ message: "Invalid release record ID" });

    const record = await ReleaseItem.find({ releaseRecord: relRecord });
    if (!record || record.length === 0) return res.status(404).json({ message: "No records found" });

    res.status(200).json(record);
});

// @desc    Get a single release record by Mongo ID
// @route   GET /api/release/mongo/:id
// @access  Private/Admin
const getSingleReleaseRecordUsingMongo = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const record = await ReleaseItem.findById(id);
    if (!record) return res.status(404).json({ message: "No release record found" });

    res.status(200).json(record);
});

// @desc    Get all release records
// @route   GET /api/release
// @access  Private/Admin
const getAllReleaseRecords = asyncHandler(async (req, res) => {
    const records = await ReleaseItem.find({}).sort({ createdAt: -1 });
    res.status(200).json(records.length ? records : { message: "No release records in the database" });
});

// @desc    Create a single release record
// @route   POST /api/release
// @access  Private/Admin
const createSingleReleaseRecord = asyncHandler(async (req, res) => {
    const {
        releaseRecord,
        sku,
        itemName,
        category,
        price,
        quantity,
        totalCost,
        staffName,
        staffID,
        measurementUnit,
    } = req.body;

    const newRecord = await ReleaseItem.create({
        releaseRecord: releaseRecord?.toString(),
        sku: sku?.toString(),
        itemName: itemName?.toString(),
        category: category?.toString(),
        price: Number(price),
        quantity: Number(quantity),
        totalCost: Number(totalCost),
        staffName: staffName?.toString(),
        staffID: staffID?.toString(),
        measurementUnit: measurementUnit?.toString(),
    });

    res.status(201).json(newRecord);
});

// @desc    Update a single release record
// @route   PUT /api/release/:id
// @access  Private/Admin
const updateSingleReleaseRecord = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const allowedUpdates = {};
    [
        "releaseRecord",
        "sku",
        "itemName",
        "category",
        "price",
        "quantity",
        "totalCost",
        "staffName",
        "staffID",
        "measurementUnit",
    ].forEach((field) => {
        if (req.body[field] !== undefined) allowedUpdates[field] = req.body[field];
    });

    const updatedRecord = await ReleaseItem.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true, runValidators: true });

    if (!updatedRecord) return res.status(404).json({ message: "Record not found" });

    res.status(200).json(updatedRecord);
});

// @desc    Delete a single release record
// @route   DELETE /api/release/:id
// @access  Private/Admin
const deleteSingleReleaseRecord = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const record = await ReleaseItem.findById(id);
    if (!record) return res.status(404).json({ message: "Record not found" });

    await record.deleteOne();
    res.status(200).json({ message: "Record deleted successfully" });
});

module.exports = {
    getSingleReleaseRecord,
    getSingleReleaseRecordUsingMongo,
    getAllReleaseRecords,
    createSingleReleaseRecord,
    updateSingleReleaseRecord,
    deleteSingleReleaseRecord,
};
