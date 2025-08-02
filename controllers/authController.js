const bcrypt = require("bcryptjs");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password, photo } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      photo,
    });

    const token = generateToken(user);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
exports.googleLogin = async (req, res) => {
  // Log the incoming request to see what data we're receiving from the frontend
  console.log("Google login request initiated with body:", req.body);
  const { name, email, photo } = req.body;

  // Validate that the email exists
  if (!email) {
    console.error(
      "Google login failed: Email was not provided in the request body."
    );
    return res.status(400).json({ message: "Email from Google is required." });
  }

  try {
    let user = await User.findOne({ email });

    // If the user does not exist, create a new one
    if (!user) {
      console.log(`User not found for email: ${email}. Creating a new user.`);
      user = new User({
        name,
        email,
        photo, // Save the profile picture URL from Google
        password: Math.random().toString(36).slice(-8), // Placeholder password
      });
      await user.save();
      console.log("New user created successfully.");
    } else {
      console.log(`Existing user found for email: ${email}.`);
    }

    // Check if JWT_SECRET is available (a common cause of 500 errors)
    if (!process.env.JWT_SECRET) {
      console.error("FATAL: JWT_SECRET environment variable is not set!");
      return res
        .status(500)
        .json({ message: "Internal server configuration error." });
    }

    // Create the JWT payload
    const payload = {
      id: user._id,
      role: user.role,
    };

    // Sign the token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    console.log(`JWT generated successfully for user: ${user.email}`);

    // Send the token and user data back to the client
    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo,
      },
    });
  } catch (error) {
    // Catch any other errors (e.g., database connection issues)
    console.error(
      "An unexpected error occurred in the googleLogin controller:",
      error
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
