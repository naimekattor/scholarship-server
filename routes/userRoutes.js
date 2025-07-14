const express = require("express");
const router = express.Router();
const { getProfile, getAllUsers } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

router.get("/me", authMiddleware, getProfile);
router.get("/", authMiddleware, roleMiddleware(["admin"]), getAllUsers);

module.exports = router;
