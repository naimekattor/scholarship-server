const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    universityName: String,
    universityLogo: String,
    universityLocation: String,
    worldRank: Number,
    subjectCategory: String,
    scholarshipCategory: String,
    degree: String,
    tuitionFees: Number,
    applicationFees: Number,
    serviceCharge: Number,
    stipend: String,
    postDate: Date,
    deadline: Date,
    description: String,
    postedBy: String,
    rating: { type: Number, default: 0 },
    reviews: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        userEmail: String,
        comment: String,
        rating: Number,
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);
