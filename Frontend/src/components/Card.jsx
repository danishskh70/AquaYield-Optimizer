import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Card.css';

const Card = ({ formData, onClick }) => {
  const [soilMoisture, setSoilMoisture] = useState(null);
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [loadingSensor, setLoadingSensor] = useState(true);
  const [sensorError, setSensorError] = useState(null);

  useEffect(() => {
    if (formData.userId) {
      axios.get(`https://iot-backend-6oxx.onrender.com/api/sensor-data/user/${formData.userId}`)
        .then((response) => {
          let sensorData = null;
          // Handle if response data is an array or a single object
          if (Array.isArray(response.data)) {
            if (response.data.length > 0) {
              sensorData = response.data[0];
            }
          } else if (response.data && typeof response.data === 'object') {
            sensorData = response.data;
          }

          if (sensorData) {
            setSoilMoisture(sensorData.soilmoisture);
            setTemperature(sensorData.temperature);
            setHumidity(sensorData.humidity);
          } else {
            setSoilMoisture('No data');
            setTemperature('No data');
            setHumidity('No data');
          }
          setLoadingSensor(false);
        })
        .catch((error) => {
          console.error("Error fetching sensor data:", error);
          setSensorError("Failed to fetch sensor data");
          setLoadingSensor(false);
        });
    } else {
      setLoadingSensor(false);
    }
  }, [formData.userId]);

  return (
    <div className="card" onClick={onClick}>
      <h3>{formData.cropName}</h3>
      <p><strong>Soil Type:</strong> {formData.soilType}</p>
      {/* <p><strong>Latitude:</strong> {formData.latitude}</p>
      <p><strong>Longitude:</strong> {formData.longitude}</p>
      <p><strong>Crop Age:</strong> {formData.cropAge}</p> */}
      {loadingSensor ? (
        <p>Loading sensor data...</p>
      ) : sensorError ? (
        <p style={{ color: 'red' }}>{sensorError}</p>
      ) : (
        <>
          <p><strong>Soil Moisture:</strong> {soilMoisture}</p>
          <p><strong>Temperature:</strong> {temperature}</p>
          <p><strong>Humidity:</strong> {humidity}</p>
        </>
      )}
    </div>
  );
};

export default Card;