const express = require("express");
const router = express.Router();
const csrf = require("csurf");

// CSRF middleware
const csrfProtection = csrf({ cookie: true });

const {
  getSingleReleaseRecord,
  getSingleReleaseRecordUsingMongo,
  getAllReleaseRecords,
  createSingleReleaseRecord,
  updateSingleReleaseRecord,
  deleteSingleReleaseRecord
} = require("../controllers/releaseItemsController");

// Public routes (read-only)
router.get("/", getAllReleaseRecords);
router.get("/:id", getSingleReleaseRecord);
router.get("/mongo/:id", getSingleReleaseRecordUsingMongo);

// State-changing routes (CSRF protected)
router.post("/", csrfProtection, createSingleReleaseRecord);
router.put("/:id", csrfProtection, updateSingleReleaseRecord);
router.delete("/:id", csrfProtection, deleteSingleReleaseRecord);

// Export router
module.exports = router;
