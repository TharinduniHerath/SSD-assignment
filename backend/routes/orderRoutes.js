const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const csrf = require("csurf");

// Setup CSRF protection middleware
const csrfProtection = csrf({ cookie: true });

const {
  createOrder,
  getOrderById,
  updateOrder,
  getMyOrders,
  getOrders,
  deleteOrder,
  getMonthlyIncome,
  getYearlyIncome,
  getDailyOrderCount,
  getOrderStats,
  getProductIncome,
} = require("../controllers/orderController");

// Create a new order (needs CSRF)
router.post("/", protect, csrfProtection, createOrder);

// Get single order
router.get("/:id", protect, getOrderById);

// Get current user's orders
router.get("/my/orders", protect, getMyOrders);

// Admin: get all orders
router.get("/", protect, admin, getOrders);

// Admin: update order (needs CSRF)
router.put("/:id", protect, admin, csrfProtection, updateOrder);

// Admin: delete order (needs CSRF)
router.delete("/:id", protect, admin, csrfProtection, deleteOrder);

// Admin: insights (safe, no CSRF needed)
router.get("/insights/montlyIncome", protect, admin, getMonthlyIncome);
router.get("/insights/yearlyIncome", protect, admin, getYearlyIncome);
router.get("/insights/dailyOrderCount", protect, admin, getDailyOrderCount);
router.get("/insights/orderStats", protect, admin, getOrderStats);
router.get("/insights/productIncome/:id", protect, admin, getProductIncome);

module.exports = router;
