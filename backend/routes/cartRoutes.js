const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const csrf = require('csurf');

// Setup CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

const {
  getCarts,
  getMyCart,
  createCart,
  updateCart,
  deleteCart,
} = require('../controllers/cartController');

// Create a new cart (needs CSRF)
router.post('/', protect, csrfProtection, createCart);

// Get current user's cart (safe, no CSRF needed)
router.get('/find/:userId', protect, getMyCart);

// Delete a cart (needs CSRF)
router.delete('/:id', protect, csrfProtection, deleteCart);

// Update a cart (needs CSRF)
router.put('/:id', protect, csrfProtection, updateCart);

// Admin: get all carts (safe, no CSRF needed)
router.get('/', protect, admin, getCarts);

module.exports = router;
