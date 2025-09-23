const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getPayroll,
  getPayrollById,
  addPayroll,
  updatePayroll,
  deletePayroll
} = require('../controllers/payrollController');

// Public routes (read-only)
router.get('/', getPayroll);
router.get('/:id', getPayrollById);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, addPayroll);
router.put('/:id', csrfProtection, updatePayroll);
router.delete('/:id', csrfProtection, deletePayroll);

module.exports = router;
