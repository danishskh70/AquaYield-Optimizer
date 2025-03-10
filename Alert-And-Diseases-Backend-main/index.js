//Converting sm to percentage
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require("dotenv").config();

const app = express();
app.use(express.json());


app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow all HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow all headers
    credentials: true // Allow cookies/auth headers if needed
}));




const PORT = process.env.PORT || 3000;
const EXTERNAL_NOTIFICATION_URL = "https://simple-sms-email-system.onrender.com/notifications/send";
const ROOT_DEPTH_M = 1; // Assumed root depth for moisture capacity calculation
//const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Store your API key in .env

// ---------- Crop Disease Prediction Endpoint ----------
// Load Gemini API Key
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is missing in environment variables");
    process.exit(1);
}

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Middleware to parse JSON
app.use(express.json());

// Disease prediction endpoint
app.post("/predict-diseases", async (req, res) => {
    try {
        const { crop_name, crop_age } = req.body;

        if (!crop_name || !crop_age) {
            return res.status(400).json({ error: "Missing required parameters" });
        }

        // AI Prompt
        const prompt = `
        Predict three possible diseases for ${crop_name} at age ${crop_age} days. 
        Provide symptoms and prevention methods in JSON format without code block formatting.
        Ensure response follows:
        {
          "diseases": [
            {
              "name": "Disease Name",
              "symptoms": "English symptoms",
              "prevention": "English prevention",
              "marathi_translation": {
                "नाव": "Disease Name",
                "लक्षणे": "Marathi symptoms",
                "प्रतिबंध": "Marathi prevention"
              }
            }
          ]
        } in Marathi translation name,symotoms,prevention word also in Marathi.
        `;

        // Generate AI Response
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        // Remove unwanted code block formatting (` ```json `)
        responseText = responseText.replace(/^```json\n/, "").replace(/\n```$/, "");

        let diseases = [];
        try {
            diseases = JSON.parse(responseText);
        } catch (error) {
            console.warn("Invalid JSON response from Gemini AI, returning raw text.");
            return res.status(500).json({ error: "Invalid AI Response", rawResponse: responseText });
        }

        // Return structured response
        res.json({ diseases });

    } catch (error) {
        console.error("Error predicting diseases:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});




// ---------- Data Loading & Caching ----------
let cropData = {};
fs.readFile('crop_data.json', 'utf8', (err, data) => {
    if (err) return console.error("Crop data load error:", err);
    
    try {
        const { crops } = JSON.parse(data);
        crops.forEach(crop => {
            crop.soil_types.forEach(soil => {
                const key = `${crop.crop_name}-${soil.soil_type}`;
                cropData[key] = {
                    phases: soil.growth_phases.map(phase => ({
                        phase: phase.phase,
                        duration: phase.duration_days,
                        irrigation: phase.irrigation_depth_m,
                        interval: phase.irrigation_interval_days,
                        moisture: phase.optimal_moisture_m3_per_m3
                    })),
                    moistureCapacity: soil.moisture_holding_capacity_m3_per_m3
                };
            });
        });
        console.log("Crop data loaded");
    } catch (e) {
        console.error("Crop data parse error:", e);
    }
});

// ---------- Helper Functions ----------
const getCurrentPhase = (phases, ageDays) => {
    let cumulative = 0;
    for (const phase of phases) {
        const avgDuration = (phase.duration.min + phase.duration.max) / 2;
        if (ageDays <= cumulative + avgDuration) return phase;
        cumulative += avgDuration;
    }
    return phases[phases.length - 1];
};

const getPrecipitation = async (lat, lon) => {
    try {
        const { data } = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=precipitation_sum&forecast_days=7`
        );
        return data.daily.precipitation_sum.reduce((a, b) => a + b, 0);
    } catch (e) {
        console.error("Weather API error:", e.message);
        return 0;
    }
};

const sendNotification = async (email, mobile, message) => {
    mobile = "+91"+mobile;
    try {
        await axios.post(EXTERNAL_NOTIFICATION_URL, { email, mobile, message });
        return true;
    } catch (e) {
        console.error("Notification error:", e.message);
        return false;
    }
};


// ---------- 7Days Weather Forecast ----------
app.get('/api/forecast', async (req, res) => {
    try {
        const { lat, lon } = req.query;

        if (!lat || !lon) {
            return res.status(400).json({
                success: false,
                error: 'Please provide latitude and longitude parameters'
            });
        }

        const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&forecast_days=7&timezone=auto`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.reason || 'Failed to fetch weather data');
        }

        const forecast = data.daily.time.map((date, index) => ({
            date,
            temperature_max: data.daily.temperature_2m_max[index],
            temperature_min: data.daily.temperature_2m_min[index],
            precipitation: data.daily.precipitation_sum[index],
            humidity: data.daily.relative_humidity_2m_mean[index],
            weather_code: data.daily.weather_code[index]
        }));

        res.json({
            success: true,
            latitude: data.latitude,
            longitude: data.longitude,
            forecast
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});


// ---------- Core Logic ----------
app.post('/irrigation-check', async (req, res) => {
    try {
        const {
            crop_name: cropName,
            soil_type: soilType,
            age: ageDays,
            current_soil_moisture: currentMoisturePercent, // Expecting in percentage (0-100%)
            latitude: lat,
            longitude: lon,
            mobile_number: mobile,
            email_address: email
        } = req.body;

        // Validate inputs
        if (!cropName || !soilType || currentMoisturePercent === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Convert soil moisture from percentage to fraction (0-1)
        const currentMoisture = currentMoisturePercent / 100;

        // Get crop data
        const key = `${cropName}-${soilType}`;
        const crop = cropData[key];
        if (!crop) return res.status(400).json({ error: "Crop/soil combination not found" });

        // Get current growth phase
        const phase = getCurrentPhase(crop.phases, ageDays);

        // Convert moisture holding capacity from fraction (0-1) to mm water depth
        const moistureCapacity = (crop.moistureCapacity.min + crop.moistureCapacity.max) / 2 * ROOT_DEPTH_M * 1000; // in mm

        // Get optimal soil moisture range
        const optimalMin = phase.moisture.min;
        const optimalMax = phase.moisture.max;

        // Calculate deficit if current moisture is below optimal min
        const deficit = (currentMoisture < optimalMin) ? (optimalMin - currentMoisture) * moistureCapacity : 0;

        // Calculate irrigation requirements based on the phase
        const avgDepth = (phase.irrigation.min + phase.irrigation.max) / 2 * 1000; // Convert m to mm
        const avgInterval = (phase.interval.min + phase.interval.max) / 2;
        const requiredIrrigation = (avgDepth / avgInterval) * 7; // mm per week

        // Get precipitation forecast
        const precipitation = await getPrecipitation(lat, lon);

        // Calculate water needed for irrigation

    
    const waterNeeded = (deficit + requiredIrrigation - precipitation > 0) ? (deficit + requiredIrrigation - precipitation) : 0;
        const needsIrrigation = (waterNeeded > 0) && (currentMoisture < optimalMin);

        // Send notifications if irrigation is needed
        let alertStatus = 'not sent';
        if (needsIrrigation) {
            const message = `Irrigation needed: ${waterNeeded.toFixed(1)}mm required ` +
            `सिंचनाची आवश्यकता: ${waterNeeded.toFixed(1)}मिमी आवश्यक`;
            alertStatus = await sendNotification(email, mobile, message) ? 'sent' : 'failed';
        }

        // Prepare response
        res.json({
            irrigation_required: needsIrrigation,
            water_needed: needsIrrigation ? waterNeeded.toFixed(2) : 0,
            precipitation_forecast: precipitation.toFixed(2),
            alert_status: alertStatus,
            current_soil_moisture_percent: currentMoisturePercent // Return in percentage for better understanding
        });

    } catch (e) {
        console.error("API error:", e);
        res.status(500).json({ error: "Internal server error" });
    }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
