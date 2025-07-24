const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// --- Middlewares ---
// Enable Cross-Origin Resource Sharing
app.use(cors());
// Parse incoming JSON requests
app.use(express.json());

// --- Import Route Modules ---
const authRoutes = require("./routes/authRoutes");
const scholarshipRoutes = require("./routes/scholarshipRoutes");
const userRoutes = require("./routes/userRoutes");
const applicationRoutes =require("./routes/applicationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // For admin analytics

// --- API Routes ---
// Assigns a base path to each route module
app.use("/api/auth", authRoutes);
app.use("/api/scholarships", scholarshipRoutes);
app.use("/api/users", userRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/dashboard", dashboardRoutes);

// --- Default Route ---
// A simple welcome message for the root URL to confirm the server is running
app.get("/", (req, res) => {
  res.send("Scholarship Management System API is running successfully.");
});


// --- Database Connection and Server Initialization ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully.");
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1); // Exit the process with an error code
  });