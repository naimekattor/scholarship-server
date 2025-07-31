const Review = require("../models/Review");
const Scholarship = require("../models/Scholarship");
const mongoose = require("mongoose");

// Recalculates and updates the average rating for a scholarship
async function updateScholarshipRating(scholarshipId) {
  const scholarship = await Scholarship.findById(scholarshipId);
  if (!scholarship) return;

  const reviews = await Review.find({ scholarshipId: scholarshipId });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  scholarship.averageRating =
    reviews.length > 0 ? (totalRating / reviews.length).toFixed(2) : 0;

  await scholarship.save();
}

// User creates a review
exports.createReview = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    const { reviewComment, rating, reviewerImage } = req.body;
    const user = req.user;

    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship)
      return res.status(404).json({ message: "Scholarship not found." });

    const review = await Review.create({
      scholarshipId,
      userId: user.id,
      userName: user.name,
      reviewerImage,
      reviewComment,
      rating,
    });

    scholarship.reviews.push(review._id);
    await scholarship.save();
    await updateScholarshipRating(scholarshipId);

    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding review", error: err.message });
  }
};

// Get all reviews for Admin/Moderator
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate(
      "scholarshipId",
      "scholarshipName universityName"
    );
    res.json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get reviews", error: err.message });
  }
};

// User gets their own reviews
exports.getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user.id }).populate(
      "scholarshipId",
      "scholarshipName universityName"
    );
    res.json(reviews);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to get reviews", error: err.message });
  }
};

// User updates their own review
exports.updateMyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewComment, rating } = req.body;

    const review = await Review.findOne({ _id: id, userId: req.user.id });
    if (!review)
      return res
        .status(404)
        .json({
          message: "Review not found or you are not authorized to edit it.",
        });

    review.reviewComment = reviewComment;
    review.rating = rating;
    await review.save();

    await updateScholarshipRating(review.scholarshipId);
    res.json({ message: "Review updated successfully", review });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating review", error: err.message });
  }
};

// User deletes their own review
exports.deleteMyReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!review)
      return res
        .status(404)
        .json({
          message: "Review not found or you are not authorized to delete it.",
        });

    await Scholarship.updateOne(
      { _id: review.scholarshipId },
      { $pull: { reviews: review._id } }
    );
    await updateScholarshipRating(review.scholarshipId);

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: err.message });
  }
};

// Admin/Moderator deletes any review
exports.deleteReviewByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) return res.status(404).json({ message: "Review not found." });

    await Scholarship.updateOne(
      { _id: review.scholarshipId },
      { $pull: { reviews: review._id } }
    );
    await updateScholarshipRating(review.scholarshipId);

    res.json({ message: "Review deleted successfully by admin" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting review", error: err.message });
  }
};
