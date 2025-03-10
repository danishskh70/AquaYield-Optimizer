// controllers/farmerController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Farmer = require("../models/farmer");

// Registration: Create a new farmer
const createFarmer = async (req, res) => {
  try {
    const { name, mobile, email, password } = req.body;

    if (!name || !mobile || !email || !password) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    // Check if the email already exists
    const existingFarmerByEmail = await Farmer.findOne({ email });
    if (existingFarmerByEmail) {
      return res.status(409).json({ error: 'Email is already registered.' });
    }

    // Check if the mobile number already exists
    const existingFarmerByMobile = await Farmer.findOne({ mobile });
    if (existingFarmerByMobile) {
      return res.status(409).json({ error: 'Mobile number is already registered.' });
    }

    // Create a new farmer (password is hashed via the pre-save hook)
    const newFarmer = new Farmer({ name, mobile, email, password });
    await newFarmer.save();

    // Exclude the password from the response
    const farmerResponse = newFarmer.toObject();
    delete farmerResponse.password;

    res.status(201).json(farmerResponse);
  } catch (error) {
    console.error("Error during farmer registration:", error);
    res.status(500).json({ error: 'Registration failed. Please try again later.' });
  }
};

// Login: Verify credentials and return a token along with farmer details (including mobile)
const loginFarmer = async (req, res) => {
  try {
    const { email, mobile, password } = req.body;

    if ((!email && !mobile) || !password) {
      return res.status(400).json({ message: "Please provide either email or mobile and a password." });
    }

    // Find the farmer by email or mobile
    const query = email ? { email } : { mobile };
    const farmer = await Farmer.findOne(query);

    if (!farmer) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: farmer._id, mobile: farmer.mobile, email: farmer.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      farmer: {
        id: farmer._id,
        name: farmer.name,
        email: farmer.email,
        mobile: farmer.mobile, // Mobile is the unique identifier
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An internal error occurred. Please try again later." });
  }
};

// Get all farmers (optional, for admin or testing purposes)
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find().select("-password");
    res.status(200).json(farmers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createFarmer, getAllFarmers, loginFarmer };