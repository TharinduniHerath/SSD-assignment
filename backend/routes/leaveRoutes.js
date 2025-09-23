const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getLeave,
  getLeaveById,
  addLeave,
  updateLeave,
  deleteLeave
} = require('../controllers/leaveController');

// Public routes (read-only)
router.get('/', getLeave);
router.get('/:id', getLeaveById);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, addLeave);
router.put('/:id', csrfProtection, updateLeave);
router.delete('/:id', csrfProtection, deleteLeave);

module.exports = router;
