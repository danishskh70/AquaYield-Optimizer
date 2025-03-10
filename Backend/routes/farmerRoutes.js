// // routes/farmerRoutes.js
// const express = require("express");
// const router = express.Router();

// const { createFarmer, getAllFarmers, loginFarmer } = require("../controllers/farmerController");
// const { getAllSoilAnalyses, createSoilAnalysis } = require('../controllers/soilAnalysisController');

// router.get("/farmers/", getAllFarmers);
// router.post("/farmers/login", loginFarmer);
// router.post("/farmers/create", createFarmer);

// // Soil analysis routes
// router.get("/farmers/analyses", getAllSoilAnalyses);
// router.post("/farmers/analyses", createSoilAnalysis);

// module.exports = router;

// routes/farmerRoutes.js
const express = require("express");
const router = express.Router();

const { createFarmer, getAllFarmers, loginFarmer } = require("../controllers/farmerController");
const { getAllSoilAnalyses, createSoilAnalysis,checkIrrigationForLatestAnalysis } = require('../controllers/soilAnalysisController');

// Farmer endpoints
router.get("/farmers/", getAllFarmers);
router.post("/farmers/login", loginFarmer);
router.post("/farmers/register", createFarmer);

// Soil analysis endpoints
router.get("/farmers/analyses", getAllSoilAnalyses);
router.post("/farmers/analyses", createSoilAnalysis);

router.get("/farmers/analyses/latest-irrigation", checkIrrigationForLatestAnalysis);

module.exports = router;