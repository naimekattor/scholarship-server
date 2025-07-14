const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  getUserDashboard,
  getModeratorDashboard,
  getAdminDashboard,
} = require("../controllers/dashboardController");

router.get("/user", authMiddleware, roleMiddleware(["user"]), getUserDashboard);
router.get(
  "/moderator",
  authMiddleware,
  roleMiddleware(["moderator"]),
  getModeratorDashboard
);
router.get(
  "/admin",
  authMiddleware,
  roleMiddleware(["admin"]),
  getAdminDashboard
);

module.exports = router;
