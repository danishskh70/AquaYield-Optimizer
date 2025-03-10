
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Chart } from "chart.js/auto";
import "../styles/Dashboard.css";



const Dashboard = () => {
  // States for current sensor readings
  const [currentMoisture, setCurrentMoisture] = useState(50);
  const [currentTemperature, setCurrentTemperature] = useState(25);
  const [currentHumidity, setCurrentHumidity] = useState(60);
  const [error, setError] = useState(null);
  // State for user location (latitude and longitude)
  const [location, setLocation] = useState({ lat: null, lon: null });
  // State for 24h sensor data array (if needed for statistics or other use)
  const [sensorData, setSensorData] = useState([]);

  // Refs for 24h sensor charts
  const moistureChartRef = useRef(null);
  const temperatureChartRef = useRef(null);
  const humidityChartRef = useRef(null);
  // Refs for 7-Day forecast charts
  const forecastChartRef = useRef(null);           // Temperature forecast (max & min)
  const precipitationChartRef = useRef(null);        // Precipitation forecast
  const forecastHumidityChartRef = useRef(null);     // Forecast humidity

  // -------------------- Fetch Current Readings --------------------
  const fetchCurrentReadings = async () => {
    try {
      const [moistureRes, tempRes, humidityRes] = await Promise.all([
        axios.get("https://iot-backend-6oxx.onrender.com/api/sensor-data/soilmoisture/current"),
        axios.get("https://iot-backend-6oxx.onrender.com/api/sensor-data/temp/current"),
        axios.get("https://iot-backend-6oxx.onrender.com/api/sensor-data/humidity/current"),
      ]);
      setCurrentMoisture(moistureRes.data.soilmoisture || 50);
      setCurrentTemperature(tempRes.data.temperature || 25);
      setCurrentHumidity(humidityRes.data.humidity || 60);
    } catch (error) {
      console.error("Error fetching current readings:", error);
      setError("Failed to fetch current readings.");
    }
  };

  // -------------------- Fetch 24-Hour Sensor Data --------------------
  const fetch24hSensorData = async () => {
    try {
      const response = await axios.get("https://iot-backend-6oxx.onrender.com/api/sensor-data/24h");
      const data = response.data;
      if (!Array.isArray(data) || data.length === 0) {
        console.warn("No sensor data available for the last 24 hours.");
        return;
      }
      setSensorData(data);

      // Prepare labels from createdAt (formatted as HH:MM)
      const labels = data.map((item) => {
        const d = new Date(item.createdAt);
        const hours = d.getHours().toString().padStart(2, "0");
        const minutes = d.getMinutes().toString().padStart(2, "0");
        return `${hours}:${minutes}`;
      });
      const moistureValues = data.map((item) => item.soilmoisture);
      const temperatureValues = data.map((item) => item.temperature);
      const humidityValues = data.map((item) => item.humidity);

      // Update or create 24h charts
      updateChart(
        moistureChartRef,
        labels,
        moistureValues,
        "Soil Moisture (24h)",
        "line",
        "rgba(75, 192, 192, 1)",
        [0, 100]
      );
      updateChart(
        temperatureChartRef,
        labels,
        temperatureValues,
        "Temperature (24h)",
        "line",
        "rgba(255, 99, 132, 1)",
        [0, 40]
      );
      updateChart(
        humidityChartRef,
        labels,
        humidityValues,
        "Humidity (24h)",
        "line",
        "rgba(54, 162, 235, 1)",
        [0, 100]
      );
    } catch (error) {
      console.error("Error fetching 24h sensor data:", error);
      setError("Failed to fetch 24h sensor data.");
    }
  };

  // -------------------- Fetch 7-Day Forecast Data --------------------
  const fetchForecastData = async () => {
    if (!location.lat || !location.lon) {
      console.warn("User location not available yet.");
      return;
    }
    try {
      // Build forecast endpoint URL using user's location
      const forecastUrl = `https://alert-and-diseases-backend.onrender.com/api/forecast?lat=${location.lat}&lon=${location.lon}`;
      const response = await axios.get(forecastUrl);
      const forecastData = response.data.forecast;
      if (!Array.isArray(forecastData) || forecastData.length === 0) {
        console.warn("No forecast data available.");
        return;
      }

      // Extract arrays from forecast data
      const labels = forecastData.map((item) => item.date);
      const maxTemps = forecastData.map((item) => item.temperature_max);
      const minTemps = forecastData.map((item) => item.temperature_min);
      const precipitationValues = forecastData.map((item) => item.precipitation);
      const forecastHumidityValues = forecastData.map((item) => item.humidity);

      // --- Temperature Forecast Chart (Max & Min) ---
      if (!forecastChartRef.current) {
        const ctx = document.getElementById("Forecast-chart");
        forecastChartRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Max Temperature (°C)",
                data: maxTemps,
                borderColor: "rgba(255, 99, 132, 1)",
                backgroundColor: "rgba(255, 99, 132, 0.2)",
                fill: false,
              },
              {
                label: "Min Temperature (°C)",
                data: minTemps,
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: false },
            },
          },
        });
      } else {
        forecastChartRef.current.data.labels = labels;
        forecastChartRef.current.data.datasets[0].data = maxTemps;
        forecastChartRef.current.data.datasets[1].data = minTemps;
        forecastChartRef.current.update();
      }

      // --- Precipitation Forecast Chart ---
      if (!precipitationChartRef.current) {
        const ctx = document.getElementById("Precipitation-chart");
        precipitationChartRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Precipitation (mm)",
                data: precipitationValues,
                borderColor: "rgba(0, 123, 255, 1)",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      } else {
        precipitationChartRef.current.data.labels = labels;
        precipitationChartRef.current.data.datasets[0].data = precipitationValues;
        precipitationChartRef.current.update();
      }

      // --- Forecast Humidity Chart ---
      if (!forecastHumidityChartRef.current) {
        const ctx = document.getElementById("Forecast-Humidity-chart");
        forecastHumidityChartRef.current = new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Forecast Humidity (%)",
                data: forecastHumidityValues,
                borderColor: "rgba(255, 205, 86, 1)",
                backgroundColor: "rgba(255, 205, 86, 0.2)",
                fill: false,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      } else {
        forecastHumidityChartRef.current.data.labels = labels;
        forecastHumidityChartRef.current.data.datasets[0].data = forecastHumidityValues;
        forecastHumidityChartRef.current.update();
      }
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };

  // -------------------- Helper Function: Create/Update Chart --------------------
  const updateChart = (
    chartRef,
    labels,
    dataValues,
    labelText,
    chartType,
    borderColor,
    yDomain = null
  ) => {
    if (!chartRef.current) {
      const ctx = document.getElementById(`${labelText.replace(/\s+/g, "-")}-chart`);
      chartRef.current = new Chart(ctx, {
        type: chartType,
        data: {
          labels,
          datasets: [
            {
              label: labelText,
              data: dataValues,
              borderColor: borderColor,
              backgroundColor: borderColor.replace("1)", "0.2)"),
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ...(yDomain && { min: yDomain[0], max: yDomain[1] }),
            },
          },
        },
      });
    } else {
      chartRef.current.data.labels = labels;
      chartRef.current.data.datasets[0].data = dataValues;
      chartRef.current.update();
    }
  };

  // -------------------- Request User Location on Mount --------------------
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          // Use default location (New York City) if permission is denied
          setLocation({ lat: 40.712, lon: -74.0060 });
        }
      );
    } else {
      // If geolocation isn't available, use default location.
      setLocation({ lat: 40.712, lon: -74.0060 });
    }
  }, []);

  // -------------------- Fetch Data on Mount and at Intervals --------------------
  useEffect(() => {
    fetchCurrentReadings();
    fetch24hSensorData();
    fetchForecastData();
    const interval24h = setInterval(fetch24hSensorData, 60000); // Every minute
    const intervalForecast = setInterval(fetchForecastData, 600000); // Every 10 minutes
    return () => {
      clearInterval(interval24h);
      clearInterval(intervalForecast);
    };
  }, [location]);

  return (
    <div className="dashbord">
    <div className="dashboard-container">
    <h2>Current Readings</h2>
   
    <div className="current-readings">
    
    
    <div className="reading animated">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4Ue0FghHSqMp9UNhFu8lkZDcoeJ6m3k_DgEY0mtk5TEgPzs8p9sGaTTpJSleF3j_p7TA&usqp=CAU" // path to your image
          alt="Soil Moisture"
          style={{ width: '24px', height: '24px', marginRight: '10px' }}
        />
        {currentMoisture}% <span>Soil Moisture</span>
    </div>
    
    <div className="reading animated">
        <img
          src="data:image/png;base64,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" // path to your image
          alt="Temperature"
          style={{ width: '24px', height: '24px', marginRight: '10px' }}
        />
        {currentTemperature}°C <span>Temperature</span>
    </div>
    
    <div className="reading animated">
        <img
          src="data:image/jpeg;base64,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" // path to your image
          alt="Humidity"
          style={{ width: '24px', height: '24px', marginRight: '10px' }}
        />
        {currentHumidity}% <span>Humidity</span>
    </div>
</div>

      

      <div className="charts-container">
        {/* 24-Hour Sensor Data Charts */}
        <div className="chart-box">
          <h3>Soil Moisture (24h)</h3>
          <canvas id="Soil-Moisture-(24h)-chart"></canvas>
        </div>
        <div className="chart-box">
          <h3>Temperature (24h)</h3>
          <canvas id="Temperature-(24h)-chart"></canvas>
        </div>
        <div className="chart-box">
          <h3>Humidity (24h)</h3>
          <canvas id="Humidity-(24h)-chart"></canvas>
        </div>

        {/* 7-Day Forecast Charts */}
        <div className="chart-box">
          <h3>7-Day Forecast (Temperature)</h3>
          <canvas id="Forecast-chart"></canvas>
        </div>
        <div className="chart-box">
          <h3>7-Day Forecast (Precipitation)</h3>
          <canvas id="Precipitation-chart"></canvas>
        </div>
        <div className="chart-box">
          <h3>7-Day Forecast (Humidity)</h3>
          <canvas id="Forecast-Humidity-chart"></canvas>
        </div>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
    </div>
  );
};

export default Dashboard;