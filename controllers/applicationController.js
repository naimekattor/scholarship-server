const Application = require("../models/Application");
const Scholarship = require("../models/Scholarship");

exports.applyForScholarship = async (req, res) => {
  try {
    const scholarship = await Scholarship.findById(req.params.id);
    if (!scholarship)
      return res.status(404).json({ message: "Scholarship not found" });

    const appData = req.body;
    const newApplication = new Application({
      ...appData,
      userId: req.user.id,
      userName: req.user.name,
      userEmail: req.user.email,
      scholarshipId: scholarship._id,
      universityName: scholarship.universityName,
      scholarshipCategory: scholarship.scholarshipCategory,
      subjectCategory: scholarship.subjectCategory,
      applicationFees: scholarship.applicationFees,
      serviceCharge: scholarship.serviceCharge,
    });

    await newApplication.save();
    res
      .status(201)
      .json({
        message: "Application submitted successfully",
        application: newApplication,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Application submission failed", error: err.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user.id });
    res.json(apps);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch applications", error: err.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: "Application not found" });
    app.status = req.body.status || app.status;
    app.feedback = req.body.feedback || app.feedback;
    await app.save();
    res.json({ message: "Application updated", app });
  } catch (err) {
    res.status(500).json({ message: "Failed to update", error: err.message });
  }
};
