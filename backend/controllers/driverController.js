const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Driver = require("../models/driverModel");

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all drivers
// @route   GET /api/drivers
// @access  Private/Admin
const getAllDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.find({});
    if (drivers.length > 0) {
        res.status(200).json(drivers);
    } else {
        res.status(404).json({ message: "No drivers found" });
    }
});

// @desc    Get single driver by driverName (sanitized)
// @route   GET /api/drivers/name/:name
// @access  Private/Admin
const getSingleDriver = asyncHandler(async (req, res) => {
    const name = req.params.name.toString(); // sanitize input
    const driver = await Driver.find({ driverName: name });
    if (driver.length > 0) {
        res.status(200).json(driver);
    } else {
        res.status(404).json({ message: "Driver not found" });
    }
});

// @desc    Create new driver
// @route   POST /api/drivers
// @access  Private/Admin
const createNewDriver = asyncHandler(async (req, res) => {
    const {
        driverName,
        nicNumber,
        driversLicenceNo,
        vehicleRegNo,
        permAddress,
        phoneNum,
        vehicleType,
        driverStatus,
    } = req.body;

    // Validate required fields
    if (
        !driverName || !nicNumber || !driversLicenceNo ||
        !vehicleRegNo || !permAddress || !phoneNum || !vehicleType
    ) {
        return res.status(400).json({ message: "Please fill all required fields" });
    }

    const driver = new Driver({
        driverName: driverName.toString(),
        nicNumber: nicNumber.toString(),
        driversLicenceNo: driversLicenceNo.toString(),
        vehicleRegNo: vehicleRegNo.toString(),
        permAddress: permAddress.toString(),
        phoneNum: phoneNum.toString(),
        vehicleType: vehicleType.toString(),
        driverStatus: driverStatus ? driverStatus.toString() : "active",
    });

    const createdDriver = await driver.save();
    res.status(201).json(createdDriver);
});

// @desc    Update driver by nicNumber (sanitized)
// @route   PUT /api/drivers/:nicNumber
// @access  Private/Admin
const updateDriverDetails = asyncHandler(async (req, res) => {
    const nicNumber = req.params.nicNumber.toString();

    const driver = await Driver.findOne({ nicNumber });
    if (!driver) {
        return res.status(404).json({ message: "Driver not found" });
    }

    // Only allow updates to specific fields
    const allowedUpdates = {};
    ["driverName", "driversLicenceNo", "vehicleRegNo", "permAddress", "phoneNum", "vehicleType", "driverStatus"].forEach(field => {
        if (req.body[field]) allowedUpdates[field] = req.body[field].toString();
    });

    const updatedDriver = await Driver.findByIdAndUpdate(driver._id, { $set: allowedUpdates }, { new: true });
    res.status(200).json(updatedDriver);
});

// @desc    Update driver by MongoDB ObjectId
// @route   PUT /api/drivers/mongo/:id
// @access  Private/Admin
const updateDriverUsingMongo = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const allowedUpdates = {};
    ["driverName", "nicNumber", "driversLicenceNo", "vehicleRegNo", "permAddress", "phoneNum", "vehicleType", "driverStatus"].forEach(field => {
        if (req.body[field]) allowedUpdates[field] = req.body[field].toString();
    });

    const updatedDriver = await Driver.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true });

    if (updatedDriver) {
        res.status(200).json(updatedDriver);
    } else {
        res.status(404).json({ message: "Driver not found" });
    }
});

// @desc    Find driver by MongoDB ObjectId
// @route   GET /api/drivers/mongo/:id
// @access  Private/Admin
const findDriverUsingMongo = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const driver = await Driver.findById(id);
    if (driver) {
        res.status(200).json(driver);
    } else {
        res.status(404).json({ message: "Driver not found" });
    }
});

// @desc    Delete driver by nicNumber
// @route   DELETE /api/drivers/:nicNumber
// @access  Private/Admin
const deleteDriver = asyncHandler(async (req, res) => {
    const nicNumber = req.params.nicNumber.toString();

    const driver = await Driver.findOne({ nicNumber });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    await Driver.deleteOne({ _id: driver._id });
    res.status(200).json({ message: "Driver deleted" });
});

module.exports = {
    getAllDrivers,
    createNewDriver,
    getSingleDriver,
    deleteDriver,
    updateDriverDetails,
    updateDriverUsingMongo,
    findDriverUsingMongo
};
