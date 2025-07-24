const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  // --- Linking to other models ---
  scholarshipId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Scholarship",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // --- User-provided information ---
  applicantPhone: { type: String, required: true },
  applicantAddress: { type: String, required: true },
  applicantGender: { type: String, required: true },
  applicantApplyingDegree: { type: String, required: true },
  applicantPhoto: { type: String, required: true }, // Added missing field
  sscResult: { type: String, required: true },
  hscResult: { type: String, required: true },
  studyGap: { type: String },

  // --- Automatically populated fields from Scholarship ---
  universityName: String,
  scholarshipCategory: String,
  subjectCategory: String,
  applicationFees: Number,
  serviceCharge: Number,

  // --- Application metadata ---
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "rejected"],
    default: "pending",
  },
  feedback: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Application", applicationSchema);