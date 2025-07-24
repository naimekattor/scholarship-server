const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getAdminStats, // New
} = require("../controllers/dashboardController");

// This file can be simplified, as dashboard data can be fetched from the other specific endpoints.
// However, the Analytics endpoint is a perfect fit here.

// Admin gets analytics/stats for the dashboard chart
router.get(
  "/admin/stats",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAdminStats
);

module.exports = router;