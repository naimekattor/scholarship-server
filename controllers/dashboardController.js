const User = require("../models/User");
const Application = require("../models/Application");
const Scholarship = require("../models/Scholarship");

exports.getUserDashboard = async (req, res) => {
  try {
    const myApps = await Application.find({ userId: req.user.id });
    res.json({ message: "User dashboard", myApps });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error loading user dashboard", error: err.message });
  }
};

exports.getModeratorDashboard = async (req, res) => {
  try {
    const allScholarships = await Scholarship.find({});
    const allApplications = await Application.find({});
    res.json({
      message: "Moderator dashboard",
      allScholarships,
      allApplications,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error loading moderator dashboard",
        error: err.message,
      });
  }
};

exports.getAdminDashboard = async (req, res) => {
  try {
    const users = await User.find();
    const applications = await Application.find();
    const scholarships = await Scholarship.find();
    res.json({ message: "Admin dashboard", users, applications, scholarships });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error loading admin dashboard", error: err.message });
  }
};
