const User = require("../models/User");
const Application = require("../models/Application");
const Scholarship = require("../models/Scholarship");

// Get analytics for the Admin Dashboard
exports.getAdminStats = async (req, res) => {
  try {
    // 1. Basic counts
    const totalUsers = await User.countDocuments();
    const totalScholarships = await Scholarship.countDocuments();
    const totalApplications = await Application.countDocuments();

    // 2. Applications by status
    const applicationsByStatus = await Application.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);
    
    // 3. Scholarships by category
     const scholarshipsByCategory = await Scholarship.aggregate([
      {
        $group: {
          _id: "$scholarshipCategory",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      message: "Admin statistics loaded successfully",
      stats: {
        totalUsers,
        totalScholarships,
        totalApplications,
        applicationsByStatus,
        scholarshipsByCategory
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error loading admin statistics", error: err.message });
  }
};