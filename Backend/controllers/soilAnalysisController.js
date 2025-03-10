// controllers/soilAnalysisController.js
const SoilAnalysis = require('../models/soilAnalysisModel');

// Get all soil analyses (could be filtered later by userId if needed)
const getAllSoilAnalyses = async (req, res) => {
  try {
    const analyses = await SoilAnalysis.find().sort({ createdAt: -1 });
    res.status(200).json(analyses);
  } catch (error) {
    console.error('Error fetching soil analyses:', error);
    res.status(500).json({ message: 'Failed to fetch soil analyses. Please try again later.' });
  }
};

// Create a new soil analysis record
const createSoilAnalysis = async (req, res) => {
  let { cropName, soilType, latitude, longitude, cropAge, userId } = req.body;

  // Validate required fields
  if (!cropName || !soilType || !latitude || !longitude || !cropAge || !userId) {
    return res.status(400).json({ message: 'All fields are required: cropName, soilType, latitude, longitude, cropAge, and userId.' });
  }

  // Trim string fields to avoid accidental spaces
  cropName = cropName.trim();
  soilType = soilType.trim();
  userId = userId.trim();

  // Parse numeric values
  const latNum = parseFloat(latitude);
  const lngNum = parseFloat(longitude);
  const cropAgeNum = Number(cropAge);

  // Validate numeric fields
  if (isNaN(latNum) || latNum < -90 || latNum > 90) {
    return res.status(400).json({ message: 'Invalid latitude. Must be a number between -90 and 90.' });
  }
  if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
    return res.status(400).json({ message: 'Invalid longitude. Must be a number between -180 and 180.' });
  }
  if (isNaN(cropAgeNum) || cropAgeNum < 1 || cropAgeNum > 365) {
    return res.status(400).json({ message: 'Invalid crop age. Must be a number between 1 and 365.' });
  }

  try {
    const newAnalysis = new SoilAnalysis({
      cropName,
      soilType,
      latitude: latNum,
      longitude: lngNum,
      cropAge: cropAgeNum,
      userId,  // This stores the farmer's mobile number
    });

    const savedAnalysis = await newAnalysis.save();

    return res.status(201).json({
      success: true,
      message: 'Soil analysis created successfully!',
      analysis: savedAnalysis,
    });
  } catch (error) {
    console.error('Error creating soil analysis:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error. Could not create analysis.',
      error: error.message,
    });
  }
};

const checkIrrigationForLatestAnalysis = async (req, res) => {
  try {
    // Retrieve the latest soil analysis record
    const latestAnalysis = await SoilAnalysis.findOne().sort({ createdAt: -1 });
    // console.log(latestAnalysis);
    if (!latestAnalysis) {
      return res.status(404).json({ message: "No soil analysis records found." });
    }

    // Fetch current soil moisture reading from the sensor endpoint
    const sensorResponse = await axios.get("https://iot-backend-6oxx.onrender.com/api/sensor-data/soilmoisture/current");
    const sensorData = sensorResponse.data; // e.g. { soilmoisture: 78, createdAt: "2025-02-09T01:43:00.000Z" }

    // Build the payload for irrigation-check
    const payload = {
      current_soil_moisture: sensorData.soilmoisture,
      crop_name: latestAnalysis.cropName,
      age: latestAnalysis.cropAge,
      soil_type: latestAnalysis.soilType,
      latitude: latestAnalysis.latitude,
      longitude: latestAnalysis.longitude,
      mobile_number: latestAnalysis.userId, // Use userId as stored
      email_address: "bhosalevivek04@gmail.com" // Default email address (adjust if needed)
    };

    // Post the payload to the irrigation-check endpoint
    const irrigationResponse = await axios.post(
      "https://alert-and-diseases-backend.onrender.com/irrigation-check",
      payload,
      { headers: { "Content-Type": "application/json" } }
    );

    return res.status(200).json({
      message: "Irrigation check completed successfully.",
      analysis: latestAnalysis,
      irrigationResult: irrigationResponse.data
    });
  } catch (error) {
    console.error("Error in irrigation check for latest analysis:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = { getAllSoilAnalyses, createSoilAnalysis ,checkIrrigationForLatestAnalysis};