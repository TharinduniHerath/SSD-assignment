const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Supplier = require("../models/supplierModel");

// Helper: Validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get supplier by agentID
// @route   GET /api/suppliers/agent/:id
// @access  Private
const getSingleSupplier = asyncHandler(async (req, res) => {
    const ID = req.params.id;

    const supplier = await Supplier.find({ agentID: ID });
    if (!supplier || supplier.length === 0) {
        return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);
});

// @desc    Get supplier by MongoDB ID
// @route   GET /api/suppliers/:id
// @access  Private
const getSingleSupplierMongo = asyncHandler(async (req, res) => {
    const mongoID = req.params.id;
    if (!validateObjectId(mongoID)) {
        return res.status(400).json({ message: "Invalid supplier ID" });
    }

    const supplier = await Supplier.findById(mongoID);
    if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(supplier);
});

// @desc    Get all suppliers
// @route   GET /api/suppliers
// @access  Private
const getAllSuppliers = asyncHandler(async (req, res) => {
    const suppliers = await Supplier.find({}).sort({ createdAt: -1 });

    if (!suppliers.length) {
        return res.status(404).json({ message: "No suppliers found" });
    }

    res.status(200).json(suppliers);
});

// @desc    Register a supplier
// @route   POST /api/suppliers
// @access  Private
const registerSupplier = asyncHandler(async (req, res) => {
    const {
        companyName,
        businessType,
        agentName,
        agentID,
        supplierCategory,
        supplyingItem,
        email,
        phone,
        companyAddress,
    } = req.body;

    const newSupplier = await Supplier.create({
        companyName: companyName?.toString(),
        businessType: businessType?.toString(),
        agentName: agentName?.toString(),
        agentID: agentID?.toString(),
        supplierCategory: supplierCategory?.toString(),
        supplyingItem: supplyingItem?.toString(),
        email: email?.toString(),
        phone: phone?.toString(),
        companyAddress: companyAddress?.toString(),
    });

    res.status(201).json(newSupplier);
});

// @desc    Update supplier
// @route   PUT /api/suppliers/:id
// @access  Private
const updateSingleSupplier = asyncHandler(async (req, res) => {
    const mongoID = req.params.id;
    if (!validateObjectId(mongoID)) {
        return res.status(400).json({ message: "Invalid supplier ID" });
    }

    const allowedUpdates = {};
    [
        "companyName",
        "businessType",
        "agentName",
        "agentID",
        "supplierCategory",
        "supplyingItem",
        "email",
        "phone",
        "companyAddress",
    ].forEach((field) => {
        if (req.body[field] !== undefined) allowedUpdates[field] = req.body[field];
    });

    const updatedSupplier = await Supplier.findByIdAndUpdate(
        mongoID,
        { $set: allowedUpdates },
        { new: true, runValidators: true }
    );

    if (!updatedSupplier) {
        return res.status(404).json({ message: "Supplier not found" });
    }

    res.status(200).json(updatedSupplier);
});

// @desc    Delete supplier
// @route   DELETE /api/suppliers/:id
// @access  Private
const deleteSingleSupplier = asyncHandler(async (req, res) => {
    const mongoID = req.params.id;
    if (!validateObjectId(mongoID)) {
        return res.status(400).json({ message: "Invalid supplier ID" });
    }

    const supplier = await Supplier.findById(mongoID);
    if (!supplier) {
        return res.status(404).json({ message: "Supplier not found" });
    }

    await supplier.deleteOne();
    res.status(200).json({ message: "Supplier deleted successfully" });
});

module.exports = {
    getSingleSupplier,
    getSingleSupplierMongo,
    getAllSuppliers,
    registerSupplier,
    updateSingleSupplier,
    deleteSingleSupplier,
};
