const Scholarship = require('../models/Scholarship');

exports.getMyReviews = async (req, res) => {
  try {
    const scholarships = await Scholarship.find({ 'reviews.userId': req.user.id });
    const reviews = scholarships.flatMap(s => s.reviews
      .filter(r => r.userId.toString() === req.user.id)
      .map(r => ({
        ...r.toObject(),
        scholarshipName: s.name || s.scholarshipCategory,
        universityName: s.universityName,
        scholarshipId: s._id
      })));
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get reviews', error: err.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const scholarship = await Scholarship.findById(req.params.scholarshipId);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    const review = scholarship.reviews.id(req.params.reviewId);
    if (!review || review.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized or not found' });

    review.rating = rating;
    review.comment = comment;
    await scholarship.save();
    res.json({ message: 'Review updated', review });
  } catch (err) {
    res.status(500).json({ message: 'Error updating review', error: err.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.scholarshipId);
    if (!scholarship) return res.status(404).json({ message: 'Scholarship not found' });

    const review = scholarship.reviews.id(req.params.reviewId);
    if (!review || review.userId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized or not found' });

    review.remove();
    await scholarship.save();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting review', error: err.message });
  }
};