const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const csrf = require('csurf');

// Setup CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

const {getProducts, getProductById, addProduct, updateProduct, deleteProduct, getProductCountByCategory, getProductStats} = require('../controllers/productController')

// Public routes (no CSRF needed, read-only)
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes (CSRF protection needed for state-changing actions)
router.post('/', protect, admin, csrfProtection, addProduct);
router.delete('/:id', protect, admin, csrfProtection, deleteProduct);
router.put('/:id', protect, admin, csrfProtection, updateProduct);

// Admin insights (read-only, no CSRF needed)
router.get('/insights/productCount', protect, admin, getProductCountByCategory);
router.get('/insights/productStats', protect, admin, getProductStats);

module.exports = router;