const express = require("express");
const router = express.Router();
const csrf = require("csurf");

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
   createNewDriver,
  getAllDrivers,
  getSingleDriver,
  deleteDriver,
  updateDriverDetails,
  updateDriverUsingMongo,   // match export
  findDriverUsingMongo      // match export
} = require("../controllers/driverController");

// Public routes (read-only)
router.get("/", getAllDrivers);
router.get("/mongo/:id", findDriverUsingMongo);
router.get("/:id", getSingleDriver);


// State-changing routes (CSRF protected)
router.post("/", csrfProtection, createNewDriver);
router.put("/:id", csrfProtection, updateDriverDetails);
router.put("/mongo/:id", csrfProtection, updateDriverUsingMongo);
router.delete("/:id", csrfProtection, deleteDriver);

module.exports = router;
