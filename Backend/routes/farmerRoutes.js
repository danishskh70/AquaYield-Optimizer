// routes/farmerRoutes.js
const express = require("express");
const { 
  createFarmer, 
  getAllFarmers, 
  loginFarmer ,
  updateFarmerDetails,
  deleteFarmer,
  getFarmerByEmail 
} = require("../controllers/farmerController");


const router = express.Router();


// Get all farmers
router.get("/", getAllFarmers);



// GET - Get a single farmer by email
router.get("/:email", getFarmerByEmail);  // Add this route for getting a single farmer by email



// Create a new farmer
router.post("/", createFarmer);



// Update farmer details (name, mobile, address, primaryCrop, waterResource)
router.put("/update/:email", updateFarmerDetails);  



// DELETE /api/farmers/delete - Delete farmer by email and password
router.delete("/delete", deleteFarmer);  // Delete route



// In farmerRoutes.js
router.get("/test", (req, res) => {
  res.status(200).json({ message: "API is working!" });
});


// Farmer login
router.post("/login", loginFarmer);  // Make sure this is here

module.exports = router;
