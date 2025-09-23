const express = require('express');
const router = express.Router();
const csrf = require('csurf');

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getServiceRecords,
  getServiceRecordById,
  addServiceRecord,
  updateServiceRecord,
  deleteServiceRecord
} = require('../controllers/servicerecordsController');

// Public routes (read-only)
router.get('/', getServiceRecords);
router.get('/:id', getServiceRecordById);

// State-changing routes (CSRF protected)
router.post('/', csrfProtection, addServiceRecord);
router.put('/:id', csrfProtection, updateServiceRecord);
router.delete('/:id', csrfProtection, deleteServiceRecord);

module.exports = router;
