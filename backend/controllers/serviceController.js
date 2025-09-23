const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Service = require('../models/serviceModel');

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Fetch all services
// @route   GET /api/services
// @access  Private/Admin
const getServices = asyncHandler(async (req, res) => {
    const qSearch = req.query.search;
    let services;

    if (qSearch) {
        services = await Service.find({ $text: { $search: qSearch } });
    } else {
        services = await Service.find();
    }

    res.status(200).json(services.length ? services : { message: "No services found" });
});

// @desc    Fetch a single service by ID
// @route   GET /api/services/:id
// @access  Private/Admin
const getServiceById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    res.status(200).json(service);
});

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const addService = asyncHandler(async (req, res) => {
    const { serviceId, serviceName, serviceCharge, serviceDescription, serviceImage } = req.body;

    const newService = await Service.create({
        serviceId: serviceId?.toString(),
        serviceName: serviceName?.toString(),
        serviceCharge: Number(serviceCharge),
        serviceDescription: serviceDescription?.toString(),
        serviceImage: serviceImage?.toString(),
    });

    res.status(201).json(newService);
});

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const allowedUpdates = {};
    ['serviceId', 'serviceName', 'serviceCharge', 'serviceDescription', 'serviceImage'].forEach(field => {
        if (req.body[field] !== undefined) allowedUpdates[field] = req.body[field];
    });

    const updatedService = await Service.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true, runValidators: true });
    if (!updatedService) return res.status(404).json({ message: "Service not found" });

    res.status(200).json(updatedService);
});

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: "Invalid ID" });

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    await service.deleteOne();
    res.status(200).json({ message: "Service removed successfully" });
});

module.exports = { getServices, getServiceById, addService, updateService, deleteService };
