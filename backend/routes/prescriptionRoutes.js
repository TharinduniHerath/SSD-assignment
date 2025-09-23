const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getPrescriptions,
  getOnePrescription,
  createPrescription,
  updatePrescription,
  deletPrescription
} = require('../controllers/prescriptionController');

// Public routes (read-only)
router.get('/', getPrescriptions);
router.get('/:id', getOnePrescription);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, createPrescription);
router.put('/:id', csrfProtection, updatePrescription);
router.delete('/:id', csrfProtection, deletPrescription);

module.exports = router;
