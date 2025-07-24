const express = require("express");
const router = express.Router();
const {
  getProfile,
  getAllUsers,
  updateUserRole, // New
  deleteUser, // New
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Any logged-in user can get their own profile
router.get("/me", authMiddleware, getProfile);

// Admin can get all users with filtering
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllUsers);

// Admin can update a user's role
router.patch(
  "/:id/role",
  authMiddleware,
  roleMiddleware(["admin"]),
  updateUserRole
);

// Admin can delete a user
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

module.exports = router;