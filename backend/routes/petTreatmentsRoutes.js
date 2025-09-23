const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getTreatments,
  getTreatmentByID,
  createTreatment,
  updateTreatment,
  deleteTreatment
} = require('../controllers/petTreatmentsController');

// Public routes (read-only)
router.get('/', getTreatments);
router.get('/:id', getTreatmentByID);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, createTreatment);
router.put('/:id', csrfProtection, updateTreatment);
router.delete('/:id', csrfProtection, deleteTreatment);

module.exports = router;
