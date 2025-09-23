const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Pet = require('../models/petRegisterModels');

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Fetch all pets
// @route   GET /api/pets
// @access  Private/Admin
const getPets = asyncHandler(async (req, res) => {
    const qSearch = req.query.search ? req.query.search.toString() : null;
    let pets;

    if (qSearch) {
        pets = await Pet.find({ $text: { $search: qSearch } });
    } else {
        pets = await Pet.find();
    }

    res.status(200).json(pets);
});

// @desc    Fetch a single pet by ID
// @route   GET /api/pets/:id
// @access  Private/Admin
const getPetByID = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const pet = await Pet.findById(id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    res.status(200).json(pet);
});

// @desc    Create a pet
// @route   POST /api/pets
// @access  Private/Admin
const createPet = asyncHandler(async (req, res) => {
    const { petID, petName, age, gender, species, breed, nic, customerName, contactNumber, medicalHistory, picture } = req.body;

    const pet = new Pet({
        petID: petID.toString(),
        petName: petName.toString(),
        age,
        gender: gender.toString(),
        species: species.toString(),
        breed: breed.toString(),
        nic: nic.toString(),
        customerName: customerName.toString(),
        contactNumber: contactNumber.toString(),
        medicalHistory: medicalHistory.toString(),
        picture: picture ? picture.toString() : null,
    });

    const savedPet = await pet.save();
    res.status(200).json(savedPet);
});

// @desc    Update a pet
// @route   PUT /api/pets/:id
// @access  Private/Admin
const updatePet = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const pet = await Pet.findById(id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    // Only allow safe fields to be updated
    const allowedUpdates = {};
    ['petID', 'petName', 'age', 'gender', 'species', 'breed', 'nic', 'customerName', 'contactNumber', 'medicalHistory', 'picture'].forEach((field) => {
        if (req.body[field] !== undefined) allowedUpdates[field] = req.body[field];
    });

    const updatedPet = await Pet.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true });
    res.status(200).json(updatedPet);
});

// @desc    Delete a pet
// @route   DELETE /api/pets/:id
// @access  Private/Admin
const deletePet = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const pet = await Pet.findById(id);
    if (!pet) return res.status(404).json({ message: 'Pet not found' });

    await pet.deleteOne();
    res.status(200).json({ message: 'Pet removed' });
});

module.exports = { getPets, getPetByID, createPet, updatePet, deletePet };
