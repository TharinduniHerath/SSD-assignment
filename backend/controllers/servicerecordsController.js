const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const ServiceRecord = require('../models/servicerecordsModel');

// Helper: Validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Fetch all service records
// @route   GET /api/records
// @access  Private/Admin
const getServiceRecords = asyncHandler(async (req, res) => {
    const qSearch = req.query.search;
    let servicerecords;

    if (qSearch) {
        servicerecords = await ServiceRecord.find({ $text: { $search: qSearch } });
    } else {
        servicerecords = await ServiceRecord.find();
    }

    res.status(200).json(servicerecords.length ? servicerecords : { message: "No service records found" });
});

// @desc    Fetch a service record by ID
// @route   GET /api/records/:id
// @access  Private
const getServiceRecordById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const servicerecord = await ServiceRecord.findById(id);
    if (!servicerecord) return res.status(404).json({ message: "Service record not found" });

    res.status(200).json(servicerecord);
});

// @desc    Create a new service record
// @route   POST /api/records
// @access  Private
const addServiceRecord = asyncHandler(async (req, res) => {
    const { recordId, serviceName, customerName, vetName, petType, date, serviceCharge } = req.body;

    const newRecord = await ServiceRecord.create({
        recordId: recordId?.toString(),
        serviceName: serviceName?.toString(),
        customerName: customerName?.toString(),
        vetName: vetName?.toString(),
        petType: petType?.toString(),
        date: new Date(date),
        serviceCharge: Number(serviceCharge),
    });

    res.status(201).json(newRecord);
});

// @desc    Update a service record
// @route   PUT /api/records/:id
// @access  Private
const updateServiceRecord = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const allowedUpdates = {};
    ['recordId', 'serviceName', 'customerName', 'vetName', 'petType', 'date', 'serviceCharge'].forEach(field => {
        if (req.body[field] !== undefined) allowedUpdates[field] = req.body[field];
    });

    const updatedRecord = await ServiceRecord.findByIdAndUpdate(id, { $set: allowedUpdates }, { 
        new: true,
        runValidators: true 
    });

    if (!updatedRecord) return res.status(404).json({ message: "Service record not found" });

    res.status(200).json(updatedRecord);
});

// @desc    Delete a service record
// @route   DELETE /api/records/:id
// @access  Private
const deleteServiceRecord = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const servicerecord = await ServiceRecord.findById(id);
    if (!servicerecord) return res.status(404).json({ message: "Service record not found" });

    await servicerecord.deleteOne();
    res.status(200).json({ message: "Service record removed successfully" });
});

module.exports = {
    getServiceRecords,
    getServiceRecordById,
    addServiceRecord,
    updateServiceRecord,
    deleteServiceRecord
};
