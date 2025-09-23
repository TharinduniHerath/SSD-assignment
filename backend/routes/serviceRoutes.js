const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getServices,
  getServiceById,
  addService,
  updateService,
  deleteService
} = require('../controllers/serviceController');

// Public routes (read-only)
router.get('/', getServices);
router.get('/:id', getServiceById);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, addService);
router.put('/:id', csrfProtection, updateService);
router.delete('/:id', csrfProtection, deleteService);

module.exports = router;
