const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  applyForScholarship,
  getMyApplications,
  updateMyApplication, // New
  cancelMyApplication, // New
  getAllApplications, // New
  updateApplicationByModerator, // Renamed and enhanced
} = require("../controllers/applicationController");

// User applies for a scholarship
router.post("/:scholarshipId/apply", authMiddleware, applyForScholarship);

// User gets their own applications
router.get("/my", authMiddleware, getMyApplications);

// User updates their own application (if status is pending)
router.put("/my/:id", authMiddleware, updateMyApplication);

// User cancels their own application
router.patch("/my/:id/cancel", authMiddleware, cancelMyApplication);

// Admin/Moderator gets all applications with sorting
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  getAllApplications
);

// Admin/Moderator updates an application (status, feedback)
router.patch(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  updateApplicationByModerator
);

module.exports = router;