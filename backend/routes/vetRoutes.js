const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getVets,
  getOneVet,
  createVet,
  updateVet,
  deleteVet
} = require('../controllers/vetController');

// Public routes (read-only)
router.get('/', getVets);
router.get('/:id', getOneVet);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, createVet);
router.put('/:id', csrfProtection, updateVet);
router.delete('/:id', csrfProtection, deleteVet);

module.exports = router;
