const Scholarship = require("../models/Scholarship");

exports.createScholarship = async (req, res) => {
  try {
    const newScholarship = new Scholarship(req.body);
    await newScholarship.save();
    res.status(201).json(newScholarship);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error creating scholarship", error: err.message });
  }
};

exports.getAllScholarships = async (req, res) => {
  try {
    const scholarships = await Scholarship.find();
    res.json(scholarships);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching scholarships", error: err.message });
  }
};

exports.getScholarshipById = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship) return res.status(404).json({ message: "Not found" });
    res.json(scholarship);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching scholarship", error: err.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship)
      return res.status(404).json({ message: "Scholarship not found" });

    scholarship.reviews.push({
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      comment,
      rating,
      date: new Date(),
    });

    scholarship.rating =
      scholarship.reviews.reduce((sum, r) => sum + r.rating, 0) /
      scholarship.reviews.length;
    await scholarship.save();
    res.status(201).json({ message: "Review added", scholarship });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding review", error: err.message });
  }
};
