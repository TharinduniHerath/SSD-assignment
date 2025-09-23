const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Vet = require('../models/vetModel');

// @desc    Fetch all vets
// @route   GET /api/vets
// @access  Private/Admin
const getVets = asyncHandler(async (req, res) => {
    const vSearch = req.query.search;
    let vets;

    if (vSearch) {
        vets = await Vet.find({ $text: { $search: vSearch } });
    } else {
        vets = await Vet.find();
    }

    res.status(200).json(vets);
});

// @desc    Fetch a single vet by ID
// @route   GET /api/vets/:id
// @access  Private/Admin
const getOneVet = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Vet ID');
    }

    const vet = await Vet.findById(id);

    if (!vet) {
        res.status(404);
        throw new Error('Vet not found');
    }

    res.status(200).json(vet);
});

// @desc    Create a vet
// @route   POST /api/vets
// @access  Private/Admin
const createVet = asyncHandler(async (req, res) => {
    const { vcslId, vetName, telephone, email, experience, qualification, profilePicture } = req.body;

    // Check for required fields
    if (!vcslId || !vetName || !telephone || !email) {
        res.status(400);
        throw new Error('Please add all required fields');
    }

    // Check for duplicate email
    const existingVet = await Vet.findOne({ email });
    if (existingVet) {
        res.status(400);
        throw new Error('Vet already exists with this email');
    }

    const vet = new Vet({
        vcslId,
        vetName,
        telephone,
        email,
        experience,
        qualification,
        profilePicture,
    });

    const savedVet = await vet.save();
    res.status(201).json(savedVet);
});

// @desc    Update a vet
// @route   PUT /api/vets/:id
// @access  Private/Admin
const updateVet = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Vet ID');
    }

    const vet = await Vet.findById(id);
    if (!vet) {
        res.status(404);
        throw new Error('Vet not found');
    }

    // Only update allowed fields
    const updates = (({ vcslId, vetName, telephone, email, experience, qualification, profilePicture }) =>
        ({ vcslId, vetName, telephone, email, experience, qualification, profilePicture }))(req.body);

    const updatedVet = await Vet.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    res.status(200).json(updatedVet);
});

// @desc    Delete a vet
// @route   DELETE /api/vets/:id
// @access  Private/Admin
const deleteVet = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400);
        throw new Error('Invalid Vet ID');
    }

    const vet = await Vet.findById(id);
    if (!vet) {
        res.status(404);
        throw new Error('Vet not found');
    }

    await vet.deleteOne();
    res.status(200).json({ message: 'Vet removed' });
});

module.exports = { getVets, getOneVet, createVet, updateVet, deleteVet };
