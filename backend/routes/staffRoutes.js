const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getStaff,
  getStaffById,
  addStaff,
  updateStaff,
  deleteStaff
} = require('../controllers/staffController');

// Public routes (read-only)
router.get('/', getStaff);
router.get('/:id', getStaffById);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, addStaff);
router.put('/:id', csrfProtection, updateStaff);
router.delete('/:id', csrfProtection, deleteStaff);

module.exports = router;
