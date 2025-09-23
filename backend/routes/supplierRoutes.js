const express = require("express");
const router = express.Router();
const csrf = require("csurf");

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getSingleSupplier,
  getSingleSupplierMongo,
  getAllSuppliers,
  updateSingleSupplier,
  deleteSingleSupplier,
  registerSupplier
} = require("../controllers/supplierController");

// Public routes (read-only)
router.get("/", getAllSuppliers);
router.get("/:id", getSingleSupplier);
router.get("/mongo/:id", getSingleSupplierMongo);

// State-changing routes (CSRF protected)
router.post("/", csrfProtection, registerSupplier);
router.put("/:id", csrfProtection, updateSingleSupplier);
router.delete("/:id", csrfProtection, deleteSingleSupplier);

// Export router
module.exports = router;
