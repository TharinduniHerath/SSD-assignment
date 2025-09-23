const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Product = require('../models/productModel');

// Helper to validate MongoDB ObjectId
const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const qSearch = req.query.search ? req.query.search.toString() : null;

    let products;

    if (qNew) {
        products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
        products = await Product.find({ 'categories.categoryA': qCategory });
    } else if (qSearch) {
        products = await Product.find({ $text: { $search: qSearch } });
    } else {
        products = await Product.find();
    }

    res.status(200).json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
});

// @desc    Add a product
// @route   POST /api/products
// @access  Private/Admin
const addProduct = asyncHandler(async (req, res) => {
    const { productName, brand, categories, quantity, price, description, SKU, image } = req.body;

    const product = new Product({ 
        productName: productName.toString(),
        brand: brand.toString(),
        categories,
        quantity: Number(quantity),
        price: Number(price),
        description: description.toString(),
        SKU: SKU.toString(),
        image: image.toString()
    });

    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Only allow safe fields to be updated
    const allowedUpdates = {};
    ['productName', 'brand', 'categories', 'quantity', 'price', 'description', 'SKU', 'image'].forEach(field => {
        if (req.body[field] !== undefined) allowedUpdates[field] = req.body[field];
    });

    const updatedProduct = await Product.findByIdAndUpdate(id, { $set: allowedUpdates }, { new: true, runValidators: true });
    res.status(200).json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!validateObjectId(id)) return res.status(400).json({ message: 'Invalid ID' });

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.deleteOne();
    res.status(200).json({ message: 'Product removed' });
});

// @desc    Get product count by categories
// @route   GET /api/products/insights/productCount
// @access  Private/Admin
const getProductCountByCategory = asyncHandler(async (req, res) => {
    const counts = await Product.aggregate([
        {
            $group: {
                _id: {
                    categoryA: "$categories.categoryA",
                    categoryB: "$categories.categoryB"
                },
                count: { $sum: 1 }
            }
        }
    ]);

    const categoryCounts = {};
    counts.forEach(item => {
        const categoryA = item._id.categoryA;
        const categoryB = item._id.categoryB;
        categoryA.forEach(aItem => {
            if (!categoryCounts[aItem]) categoryCounts[aItem] = {};
            categoryCounts[aItem][categoryB] = (categoryCounts[aItem][categoryB] || 0) + item.count;
        });
    });

    const categoryA = ["Dog", "Cat", "Fish", "Rabbit", "Bird", "Cattle", "Pig", "Hamster", "Other"];
    const categoryB = ["Food", "Accessory", "Toy"];

    const data = categoryA.map(aItem => {
        const obj = { categoryA: aItem };
        categoryB.forEach(bItem => {
            obj[bItem] = categoryCounts[aItem]?.[bItem] || 0;
        });
        return obj;
    });

    res.status(200).json(data);
});

// @desc    Get total product count
// @route   GET /api/products/insights/totalProductCount
// @access  Private/Admin
const getProductStats = asyncHandler(async (req, res) => {
    const totalProducts = await Product.countDocuments();
    res.status(200).json({ totalProducts });
});

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductCountByCategory,
    getProductStats
};
