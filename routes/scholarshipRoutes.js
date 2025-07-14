const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  createScholarship,
  getAllScholarships,
  getScholarshipById,
  addReview,
} = require("../controllers/scholarshipController");

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["moderator", "admin"]),
  createScholarship
);
router.get("/", getAllScholarships);
router.get("/:id", getScholarshipById);
router.post("/:id/reviews", authMiddleware, addReview);

module.exports = router;
