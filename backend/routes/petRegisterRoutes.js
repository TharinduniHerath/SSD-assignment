const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getPets,
  getPetByID,
  createPet,
  updatePet,
  deletePet
} = require('../controllers/petRegisterController');

// Public routes (read-only)
router.get('/', getPets);
router.get('/:id', getPetByID);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, createPet);
router.put('/:id', csrfProtection, updatePet);
router.delete('/:id', csrfProtection, deletePet);

module.exports = router;
