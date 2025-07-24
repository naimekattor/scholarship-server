const mongoose = require("mongoose");

const scholarshipSchema = new mongoose.Schema(
  {
    scholarshipName: { type: String, required: true },
    universityName: { type: String, required: true },
    universityLogo: { type: String, required: true },
    universityCountry: { type: String, required: true }, // Updated field
    universityCity: { type: String, required: true }, // Updated field
    worldRank: Number,
    subjectCategory: { type: String, required: true },
    scholarshipCategory: { type: String, required:true },
    degree: { type: String, required: true },
    tuitionFees: Number,
    applicationFees: { type: Number, required: true },
    serviceCharge: { type: Number, required: true },
    stipend: String,
    postDate: { type: Date, default: Date.now },
    deadline: { type: Date, required: true },
    description: { type: String, required: true },
    postedUserEmail: String, // Field for who posted it
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Link to standalone Review model
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scholarship", scholarshipSchema);