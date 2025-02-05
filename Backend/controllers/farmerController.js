const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Farmer = require("../models/Farmers");

// Create farmer
const createFarmer = async (req, res) => {
  try {
    const newFarmer = new Farmer(req.body);
    await newFarmer.save();
    res.status(201).json(newFarmer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const getFarmerByEmail = async (req, res) => {
  const { email } = req.params;  // Get email from URL parameter

  try {
    // Find the farmer by email
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Send the farmer data in the response
    res.status(200).json(farmer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find(); // Fetch all farmers from the database
    res.status(200).json(farmers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Login farmer
const loginFarmer = async (req, res) => {
  const { email, mobile, password } = req.body;

  try {
    // Check if either email or mobile number is provided
    const query = email ? { email } : mobile ? { mobile } : null;

    if (!query) {
      return res.status(400).json({ message: "Please provide either email or mobile number" });
    }

    // Find the farmer by email or mobile
    const farmer = await Farmer.findOne(query);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: farmer._id, email: farmer.email },
      process.env.JWT_SECRET, // Make sure to set this in your .env file
      { expiresIn: "1d" }
    );

    // Send the token in the response
    res.status(200).json({ message: "Login successful", token });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update farmer's name, mobile, primaryCrop, waterResource, and address by email
const updateFarmerDetails = async (req, res) => {
  const { email } = req.params;  // Get email from URL
  const { name, mobile, primaryCrop, waterResource, address } = req.body;  // Get data from request body

  try {
    // Find the farmer by email
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Update the fields
    if (name) farmer.name = name;
    if (mobile) farmer.mobile = mobile;
    if (primaryCrop) farmer.primaryCrop = primaryCrop;
    if (waterResource) farmer.waterResource = waterResource;
    if (address) farmer.address = address;

    // Save the updated farmer details
    await farmer.save();

    res.status(200).json({ message: "Farmer details updated successfully", farmer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete farmer by email and password
const deleteFarmer = async (req, res) => {
  const { email, password } = req.body;  // Get email and password from request body

  try {
    // Find the farmer by email
    const farmer = await Farmer.findOne({ email });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, farmer.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    // Delete the farmer
    await Farmer.deleteOne({ email });

    res.status(200).json({ message: "Farmer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createFarmer,
  getAllFarmers,
  loginFarmer,
  updateFarmerDetails,
  deleteFarmer,
  getFarmerByEmail 
};
