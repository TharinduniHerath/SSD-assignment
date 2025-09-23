const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getMedicines,
  getOneMedicine,
  createMedicine,
  updateMedicine,
  deleteMedicine
} = require('../controllers/medicineController');

// Public routes (read-only)
router.get('/', getMedicines);
router.get('/:id', getOneMedicine);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, createMedicine);
router.put('/:id', csrfProtection, updateMedicine);
router.delete('/:id', csrfProtection, deleteMedicine);

module.exports = router;
