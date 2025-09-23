const express = require("express");
const router = express.Router();
const csrf = require("csurf");

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const { 
  retrieveOrders, 
  retrieveSpecificOrder, 
  updateOrder, 
  retrieveSpecificOrderUsinMongo 
} = require('../controllers/deliverOrderController');

// Public routes (read-only)
router.get("/", retrieveOrders);
router.get("/:id", retrieveSpecificOrder);
router.get("/mongo/:id", retrieveSpecificOrderUsinMongo);

// State-changing route (CSRF protected)
router.put("/:id", csrfProtection, updateOrder);

module.exports = router;
