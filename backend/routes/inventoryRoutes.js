const express = require("express");
const router = express.Router();
const csrf = require("csurf");

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getSingleItem,
  getAllItems,
  createSingleItem,
  updateSingleItem,
  deleteSingleItem,
  getSingleItemMongo
} = require("../controllers/inventoryController");

// Public routes (read-only)
router.get("/", getAllItems);
router.get("/:id", getSingleItem);
router.get("/mongo/:id", getSingleItemMongo);

// State-changing routes (CSRF protected)
router.post("/", csrfProtection, createSingleItem);
router.put("/:id", csrfProtection, updateSingleItem);
router.delete("/:id", csrfProtection, deleteSingleItem);

// Export router
module.exports = router;
