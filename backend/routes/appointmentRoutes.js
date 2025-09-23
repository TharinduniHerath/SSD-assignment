const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });
const { protect, admin } = require('../middleware/authMiddleware');

const {
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

// Public routes (read-only)
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, createAppointment);
router.put('/:id', csrfProtection, updateAppointment);
router.delete('/:id', csrfProtection, deleteAppointment);

module.exports = router;
