const axios = require('axios');
const cron = require('node-cron');

// Set the threshold for soil moisture (in percentage)
const threshold = 30;

async function checkSoilMoisture() {
  try {
    // Fetch current soil moisture reading
    const response = await axios.get("https://iot-backend-6oxx.onrender.com/api/sensor-data/soilmoisture/current");
    const soilMoisture = response.data.soilmoisture;
    console.log(`[${new Date().toLocaleString()}] Soil moisture reading: ${soilMoisture}%`);

    // Check if the reading is below the threshold
    if (soilMoisture < threshold) {
      console.log(`Soil moisture is below threshold (${threshold}%). Calling irrigation-check...`);

      // Build the payload for irrigation-check endpoint
      const payload = {
        current_soil_moisture: soilMoisture,
        crop_name: "Wheat",                // Adjust as needed
        age: 30,                           // Adjust as needed
        soil_type: "Black",                // Adjust as needed
        latitude: 12.34,                   // Adjust as needed
        longitude: 56.78,                  // Adjust as needed
        mobile_number: "9607561857",       // Use your stored mobile number as is
        email_address: "bhosalevivek04@gmail.com" // Adjust if needed
      };

      try {
        const irrigationResponse = await axios.post(
          "https://alert-and-diseases-backend.onrender.com/irrigation-check",
          payload,
          { headers: { "Content-Type": "application/json" } }
        );
        console.log("Irrigation check result:", irrigationResponse.data);
      } catch (irrigationError) {
        console.error("Error calling irrigation-check:", irrigationError.message);
      }
    } else {
      console.log(`Soil moisture is above threshold (${threshold}%). No irrigation needed.`);
    }
  } catch (error) {
    console.error("Error checking soil moisture:", error.message);
  }
}

// Schedule the check using node-cron to run every minute at the 0-second mark
cron.schedule('0 * * * * *', () => {
  console.log("Running scheduled soil moisture check (every 1 minute)...");
  checkSoilMoisture();
});