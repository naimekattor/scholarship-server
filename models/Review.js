const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: { type: String, required: true },
  reviewerImage: { type: String }, // Added missing field
  scholarshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Scholarship',
    required: true,
  },
  reviewComment: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewDate: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);