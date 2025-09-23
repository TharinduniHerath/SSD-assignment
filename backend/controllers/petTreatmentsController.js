const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Treatments = require('../models/petTreatmentsModel');

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Fetch all treatments
// @route   GET /api/treatment
// @access  Private/Admin
const getTreatments = asyncHandler(async (req, res) => {
    const qSearch = req.query.search ? req.query.search.toString() : null;
    let treatments;

    if (qSearch) {
        treatments = await Treatments.find({ $text: { $search: qSearch } });
    } else {
        treatments = await Treatments.find();
    }

    res.status(200).json(treatments);
});

// @desc    Fetch a treatment by ID
// @route   GET /api/treatment/:id
// @access  Private/Admin
const getTreatmentByID = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const treatment = await Treatments.findById(id);
    if (!treatment) return res.status(404).json({ message: 'Treatment not found' });

    res.status(200).json(treatment);
});

// @desc    Create a treatment
// @route   POST /api/treatment
// @access  Private/Admin
const createTreatment = asyncHandler(async (req, res) => {
    const { petID, petName, nic, date, treatment, progressNotes } = req.body;

    const petTreatment = new Treatments({
        petID: petID.toString(),
        petName: petName.toString(),
        nic: nic.toString(),
        date,
        treatment: treatment.toString(),
        progressNotes: progressNotes.toString(),
    });

    const savedTreatment = await petTreatment.save();
    res.status(200).json(savedTreatment);
});

// @desc    Update a treatment
// @route   PUT /api/treatment/:id
// @access  Private/Admin
const updateTreatment = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const treatment = await Treatments.findById(id);
    if (!treatment) return res.status(404).json({ message: 'Treatment not found' });

    // Only allow safe fields to be updated
    const allowedUpdates = {};
    ['petID', 'petName', 'nic', 'date', 'treatment', 'progressNotes'].forEach((field) => {
        if (req.body[field] !== undefined) allowedUpdates[field] = req.body[field];
    });

    const updatedTreatment = await Treatments.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true });
    res.status(200).json(updatedTreatment);
});

// @desc    Delete a treatment
// @route   DELETE /api/treatment/:id
// @access  Private/Admin
const deleteTreatment = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const treatment = await Treatments.findById(id);
    if (!treatment) return res.status(404).json({ message: 'Treatment not found' });

    await treatment.deleteOne();
    res.status(200).json({ message: 'Treatment removed' });
});

module.exports = { getTreatments, getTreatmentByID, createTreatment, updateTreatment, deleteTreatment };
