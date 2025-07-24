const Application = require("../models/Application");
const Scholarship = require("../models/Scholarship");

// User applies for scholarship
exports.applyForScholarship = async (req, res) => {
  try {
    const { scholarshipId } = req.params;
    const scholarship = await Scholarship.findById(scholarshipId);
    if (!scholarship) return res.status(404).json({ message: "Scholarship not found" });

    const newApplication = new Application({
      ...req.body,
      userId: req.user.id,
      scholarshipId: scholarship._id,
      universityName: scholarship.universityName,
      scholarshipCategory: scholarship.scholarshipCategory,
      subjectCategory: scholarship.subjectCategory,
      applicationFees: scholarship.applicationFees,
      serviceCharge: scholarship.serviceCharge,
    });

    await newApplication.save();
    res.status(201).json({ message: "Application submitted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Application submission failed", error: err.message });
  }
};

// User gets their applications
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user.id });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch applications", error: err.message });
  }
};

// User updates their application
exports.updateMyApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findOne({ _id: id, userId: req.user.id });

    if (!application) return res.status(404).json({ message: "Application not found" });
    if (application.status !== "pending") {
      return res.status(403).json({ message: "Cannot edit an application that is already being processed." });
    }

    const updatedApplication = await Application.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: "Application updated successfully", application: updatedApplication });
  } catch (err) {
    res.status(500).json({ message: "Failed to update application", error: err.message });
  }
};

// User cancels their application
exports.cancelMyApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await Application.findOne({ _id: id, userId: req.user.id });

    if (!application) return res.status(404).json({ message: "Application not found" });

    application.status = "rejected"; // Or a new "canceled" status if preferred
    await application.save();
    res.json({ message: "Application successfully canceled", application });
  } catch (err) {
    res.status(500).json({ message: "Failed to cancel application", error: err.message });
  }
};


// Admin/Moderator gets all applications with sorting
exports.getAllApplications = async (req, res) => {
    try {
        const { sortBy } = req.query; // 'appliedDate' or 'deadline'
        
        let sortQuery = {};
        if (sortBy === 'appliedDate') {
            sortQuery = { 'createdAt': -1 }; // Sort by application creation date
        }

        let applications;
        if (sortBy === 'deadline') {
            // For sorting by deadline, we need to join with scholarships
             applications = await Application.aggregate([
                {
                    $lookup: {
                        from: 'scholarships',
                        localField: 'scholarshipId',
                        foreignField: '_id',
                        as: 'scholarshipDetails'
                    }
                },
                { $unwind: '$scholarshipDetails' },
                { $sort: { 'scholarshipDetails.deadline': 1 } } // 1 for ascending deadline
            ]);
        } else {
            // Default or sort by applied date
            applications = await Application.find({}).sort(sortQuery);
        }

        res.json(applications);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch applications", error: err.message });
    }
};

// Moderator/Admin updates an application status and adds feedback
exports.updateApplicationByModerator = async (req, res) => {
  try {
    const { status, feedback } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status, feedback },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json({ message: "Application updated successfully", application });
  } catch (err) {
    res.status(500).json({ message: "Failed to update application", error: err.message });
  }
};