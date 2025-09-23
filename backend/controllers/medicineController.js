const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Medicine = require('../models/medicineModel');

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Fetch all medicines (with optional search)
// @route   GET /api/medicines
// @access  Private/Admin
const getMedicines = asyncHandler(async (req, res) => {
    const qSearch = req.query.search ? req.query.search.toString() : null;
    let medicines;

    if (qSearch) {
        medicines = await Medicine.find({
            $text: { $search: qSearch }
        });
    } else {
        medicines = await Medicine.find();
    }

    res.status(200).json(medicines);
});

// @desc    Fetch a single medicine by ID
// @route   GET /api/medicines/:id
// @access  Private
const getOneMedicine = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const medicine = await Medicine.findById(id);
    if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found' });
    }

    res.status(200).json(medicine);
});

// @desc    Create a medicine
// @route   POST /api/medicines
// @access  Private
const createMedicine = asyncHandler(async (req, res) => {
    const { medicineName, uses } = req.body;

    if (!medicineName || !uses) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    const medicine = new Medicine({
        medicineName: medicineName.toString(),
        uses: uses.toString(),
    });

    const savedMedicine = await medicine.save();
    res.status(201).json(savedMedicine);
});

// @desc    Update a medicine
// @route   PUT /api/medicines/:id
// @access  Private
const updateMedicine = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const medicine = await Medicine.findById(id);
    if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found' });
    }

    const allowedUpdates = {};
    ['medicineName', 'uses'].forEach(field => {
        if (req.body[field] !== undefined) {
            allowedUpdates[field] = req.body[field].toString();
        }
    });

    const updatedMedicine = await Medicine.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true });
    res.status(200).json(updatedMedicine);
});

// @desc    Delete a medicine
// @route   DELETE /api/medicines/:id
// @access  Private
const deleteMedicine = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: 'Invalid ID' });
    }

    const medicine = await Medicine.findById(id);
    if (!medicine) {
        return res.status(404).json({ message: 'Medicine not found' });
    }

    await medicine.deleteOne();
    res.status(200).json({ message: 'Medicine removed' });
});

module.exports = { getMedicines, getOneMedicine, createMedicine, updateMedicine, deleteMedicine };
