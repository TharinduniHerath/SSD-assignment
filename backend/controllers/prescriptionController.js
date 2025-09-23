const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Prescription = require('../models/prescriptionModel');

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Fetch all prescriptions
// @route   GET /api/prescriptions
// @access  Private/Admin
const getPrescriptions = asyncHandler(async (req, res) => {
    const pSearch = req.query.search ? req.query.search.toString() : null;
    let prescriptions;

    if (pSearch) {
        prescriptions = await Prescription.find({ $text: { $search: pSearch } });
    } else {
        prescriptions = await Prescription.find();
    }

    res.status(200).json(prescriptions);
});

// @desc    Fetch a prescription by ID
// @route   GET /api/prescriptions/:id
// @access  Private
const getOnePrescription = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const prescription = await Prescription.findById(id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

    res.status(200).json(prescription);
});

// @desc    Create a prescription
// @route   POST /api/prescriptions
// @access  Private
const createPrescription = asyncHandler(async (req, res) => {
    const { petname, address, description, medicine, dosage } = req.body;

    const prescription = new Prescription({
        petname: petname.toString(),
        address: address.toString(),
        description: description.toString(),
        medicine: medicine.toString(),
        dosage: dosage.toString(),
    });

    const savedPrescription = await prescription.save();
    res.status(200).json(savedPrescription);
});

// @desc    Update a prescription
// @route   PUT /api/prescriptions/:id
// @access  Private
const updatePrescription = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const prescription = await Prescription.findById(id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

    // Only allow safe fields to be updated
    const allowedUpdates = {};
    ['petname', 'address', 'description', 'medicine', 'dosage'].forEach((field) => {
        if (req.body[field] !== undefined) allowedUpdates[field] = req.body[field];
    });

    const updatedPrescription = await Prescription.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true });
    res.status(200).json(updatedPrescription);
});

// @desc    Delete a prescription
// @route   DELETE /api/prescriptions/:id
// @access  Private
const deletPrescription = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const prescription = await Prescription.findById(id);
    if (!prescription) return res.status(404).json({ message: 'Prescription not found' });

    await prescription.deleteOne();
    res.status(200).json({ message: 'Prescription removed' });
});

module.exports = { getPrescriptions, getOnePrescription, createPrescription, updatePrescription, deletPrescription };
