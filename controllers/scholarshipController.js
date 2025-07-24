const Scholarship = require("../models/Scholarship");

// Create Scholarship (for Admin, Moderator)
exports.createScholarship = async (req, res) => {
  try {
    const scholarship = new Scholarship(req.body);
    await scholarship.save();
    res.status(201).json({ message: "Scholarship created successfully", scholarship });
  } catch (err) {
    // CORRECTED: Improved error handling
    // If validation fails, Mongoose throws an error. We catch it here.
    if (err.name === 'ValidationError') {
        // Send a 400 Bad Request with a clear message
        return res.status(400).json({ message: "Validation Error", error: err.message });
    }
    // For other types of errors, send a 500 Internal Server Error
    res.status(500).json({ message: "Error creating scholarship", error: err.message });
  }
};

// Get All Scholarships with Search, Pagination, etc.
exports.getAllScholarships = async (req, res) => {
  try {
    const { search, page = 1, limit = 9, sort, degree, subjectCategory } = req.query;
    let query = {};
    let sortOptions = { createdAt: -1 };

    if (search) {
      query.$or = [
        { scholarshipName: { $regex: search, $options: "i" } },
        { universityName: { $regex: search, $options: "i" } },
      ];
    }
    if (degree && degree !== 'all') query.degree = degree;
    if (subjectCategory && subjectCategory !== 'all') query.subjectCategory = subjectCategory;
    
    if (sort === 'top') {
        sortOptions = { applicationFees: 1, postDate: -1 };
    }

    const scholarships = await Scholarship.find(query)
      .sort(sortOptions)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .exec();

    const count = await Scholarship.countDocuments(query);
    res.json({
      scholarships,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalScholarships: count,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching scholarships", error: err.message });
  }
};

// Get Single Scholarship
exports.getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id).populate({
        path: 'reviews',
        populate: { path: 'userId', select: 'name photo' }
    });
    if (!scholarship) return res.status(404).json({ message: "Scholarship not found" });
    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ message: "Error fetching scholarship", error: err.message });
  }
};

// Update Scholarship (for Admin, Moderator)
exports.updateScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!scholarship) return res.status(404).json({ message: "Scholarship not found" });
    res.json({ message: "Scholarship updated successfully", scholarship });
  } catch (err) {
     if (err.name === 'ValidationError') {
        return res.status(400).json({ message: "Validation Error", error: err.message });
    }
    res.status(500).json({ message: "Error updating scholarship", error: err.message });
  }
};

// Delete Scholarship (for Admin, Moderator)
exports.deleteScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findByIdAndDelete(req.params.id);
    if (!scholarship) return res.status(404).json({ message: "Scholarship not found" });
    res.json({ message: "Scholarship deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting scholarship", error: err.message });
  }
};