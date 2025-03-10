// models/soilAnalysisModel.js
const mongoose = require('mongoose');

const soilAnalysisSchema = new mongoose.Schema({
  cropName: { type: String, required: true },
  soilType: { type: String, required: true },
  latitude: { type: Number, required: true },   // Number type
  longitude: { type: Number, required: true },  // Number type
  cropAge: { type: Number, required: true },
  userId: { type: String, required: true }, // Stores the farmer's mobile number
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SoilAnalysis', soilAnalysisSchema);