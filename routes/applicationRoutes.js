const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const {
  applyForScholarship,
  getMyApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");

router.post("/:id/apply", authMiddleware, applyForScholarship);
router.get("/my", authMiddleware, getMyApplications);
router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["moderator", "admin"]),
  updateApplicationStatus
);

module.exports = router;
