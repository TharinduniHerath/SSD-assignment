const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const Item = require("../models/itemModel");

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get a single item by SKU
// @route   GET /api/items/sku/:id
// @access  Private/Admin
const getSingleItem = asyncHandler(async (req, res) => {
    const sku = req.params.id.toString(); // sanitize input

    const item = await Item.find({ sku });
    if (item.length === 0) {
        return res.status(404).json({ message: "No item found with this SKU" });
    }
    res.status(200).json(item);
});

// @desc    Get a single item by MongoDB ObjectId
// @route   GET /api/items/mongo/:id
// @access  Private/Admin
const getSingleItemMongo = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const item = await Item.findById(id);
    if (!item) {
        return res.status(404).json({ message: "No item found with this ID" });
    }
    res.status(200).json(item);
});

// @desc    Get all items
// @route   GET /api/items
// @access  Private/Admin
const getAllItems = asyncHandler(async (req, res) => {
    const items = await Item.find({}).sort({ createdAt: -1 });
    if (!items || items.length === 0) {
        return res.status(404).json({ message: "No items in the inventory" });
    }
    res.status(200).json(items);
});

// @desc    Create a single item
// @route   POST /api/items
// @access  Private/Admin
const createSingleItem = asyncHandler(async (req, res) => {
    const {
        sku,
        itemName,
        category,
        price,
        rackNo,
        quantity,
        manufacturer,
        reorderLevel,
        measurementUnit,
        productImage,
    } = req.body;

    if (!sku || !itemName || !category || !price) {
        return res.status(400).json({ message: "Required fields are missing" });
    }

    const newItem = await Item.create({
        sku: sku.toString(),
        itemName: itemName.toString(),
        category: category.toString(),
        price: Number(price),
        rackNo: rackNo ? rackNo.toString() : "",
        quantity: quantity ? Number(quantity) : 0,
        manufacturer: manufacturer ? manufacturer.toString() : "",
        reorderLevel: reorderLevel ? Number(reorderLevel) : 0,
        measurementUnit: measurementUnit ? measurementUnit.toString() : "",
        productImage: productImage ? productImage.toString() : "",
    });

    res.status(201).json(newItem);
});

// @desc    Update a single item
// @route   PUT /api/items/:id
// @access  Private/Admin
const updateSingleItem = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const allowedUpdates = {};
    const fields = [
        "sku", "itemName", "category", "price",
        "rackNo", "quantity", "manufacturer",
        "reorderLevel", "measurementUnit", "productImage"
    ];

    fields.forEach(field => {
        if (req.body[field] !== undefined) {
            allowedUpdates[field] = typeof req.body[field] === "string" ? req.body[field].toString() : req.body[field];
        }
    });

    const updatedItem = await Item.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true });

    if (!updatedItem) {
        return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(updatedItem);
});

// @desc    Delete a single item
// @route   DELETE /api/items/:id
// @access  Private/Admin
const deleteSingleItem = asyncHandler(async (req, res) => {
    const id = req.params.id;

    if (!validateObjectId(id)) {
        return res.status(400).json({ message: "Invalid ID" });
    }

    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
        return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json({ message: "Item deleted from the database" });
});

module.exports = {
    getSingleItem,
    getSingleItemMongo,
    getAllItems,
    createSingleItem,
    updateSingleItem,
    deleteSingleItem
};
