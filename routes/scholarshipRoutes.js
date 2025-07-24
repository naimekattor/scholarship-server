const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  createScholarship,
  getAllScholarships,
  getScholarshipById,
  updateScholarship,
  deleteScholarship,
} = require("../controllers/scholarshipController");

// Admin / Moderator can create a scholarship
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  createScholarship
);

// Public route to get all scholarships with search, filtering, and pagination
router.get("/", getAllScholarships);

// A logged-in user can get a single scholarship by ID
router.get("/:id", authMiddleware, getScholarshipById);

// Admin / Moderator can update a scholarship
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  updateScholarship
);

// Admin / Moderator can delete a scholarship
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "moderator"]),
  deleteScholarship
);

module.exports = router;