const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  userName: String,
  userEmail: String,
  scholarshipId: mongoose.Schema.Types.ObjectId,
  universityName: String,
  scholarshipCategory: String,
  subjectCategory: String,
  appliedDegree: String,
  phone: String,
  address: String,
  gender: String,
  sscResult: String,
  hscResult: String,
  studyGap: String,
  applicationFees: Number,
  serviceCharge: Number,
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "rejected"],
    default: "pending",
  },
  feedback: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Application", applicationSchema);
