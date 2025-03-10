import { useEffect } from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom'; // To get the state passed during navigation
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';
import '../styles/AnalysisResults.css';

// Register necessary components of Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

const AnalysisResults = () => {

    const location = useLocation();
    const { formData } = location.state || {}; 
    const [diseaseData, setDiseaseData] = useState(null);
    const [isMarathi, setIsMarathi] = useState(false)

    useEffect(() => {
        if (formData && formData.cropName && formData.cropAge) {
            fetchDiseaseData(formData.cropName, formData.cropAge);
        }
    }, [formData]);

    const fetchDiseaseData = async (cropName, cropAge) => {
        try {
            const response = await axios.post(
                "https://alert-and-diseases-backend.onrender.com/predict-diseases",
                { crop_name: cropName, crop_age: parseInt(cropAge) }
            );

            console.log("Disease Data Response:", response.data);
            setDiseaseData(response.data);
        } catch (error) {
            console.error("Error fetching disease data:", error);
        } 
    };
   
    
    if (!formData) {
        return <div>No analysis data found</div>;
    }

    // Destructure data from formData
    const { cropName, cropAge, soilType, latitude, longitude,  additional_info } = formData;

    // Sample chart data (replace with actual data if necessary)
    const moistureData = [65, 59, 80, 81, 56];
    const weatherData = [22, 24, 27, 23, 20];

    const moistureChartData = {
        labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'],
        datasets: [{
            label: 'Soil Moisture (%)',
            data: moistureData,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            pointRadius: 0
        }]
    };

  
    return (
        <div className='container'>
            <div className="result-card">
                <h2>Analysis Results</h2>

                {/* Display any error message if present */}
                {formData.error_message && <div className="error-message">{formData.error_message}</div>}

                <div className="summary-grid">
                    {/* Display data passed via formData */}
                    <div className="summary-item">
                        <h4>Crop Name</h4>
                        <p>{cropName || 'N/A'}</p>
                    </div>
                    <div className="summary-item">
                        <h4>Crop Age</h4>
                        <p>{cropAge || 'N/A'}</p>
                    </div>
                    <div className="summary-item">
                        <h4>Soil Type</h4>
                        <p>{soilType || 'N/A'}</p>
                    </div>
                    <div className="summary-item">
                        <h4>Latitude</h4>
                        <p>{latitude || 'N/A'}</p>
                    </div>
                    <div className="summary-item">
                        <h4>Longitude</h4>
                        <p>{longitude || 'N/A'}</p>
                    </div>
                </div>

                <div className="result-section">
                    <h3>Soil Moisture Analysis</h3>
                    <ul>
                    </ul>
                </div>

                <div className="result-section">
            <h3>Potential Diseases and Prevention</h3>
            <button onClick={() => setIsMarathi(!isMarathi)} className="toggle-button">
                {isMarathi ? 'Change to English' : 'Change to Marathi'}
            </button>
            {diseaseData && diseaseData.diseases && diseaseData.diseases.diseases.length > 0 ? (
                diseaseData.diseases.diseases.map((disease, index) => (
                    <div key={index} className="disease-prediction">
                        {isMarathi ? (
                            <>
                                <h4>{disease.marathi_translation?.नाव}</h4>
                                <p><strong>लक्षणे:</strong> {disease.marathi_translation?.लक्षणे}</p>
                                <p><strong>प्रतिबंध:</strong> {disease.marathi_translation?.प्रतिबंध}</p>
                            </>
                        ) : (
                            <>
                                <h4>{disease.name}</h4>
                                <p><strong>Symptoms:</strong> {disease.symptoms}</p>
                                <p><strong>Prevention:</strong> {disease.prevention}</p>
                            </>
                        )}
                    </div>
                ))
            ) : (
                <p>No disease predictions available.</p>
            )}
        </div>

                <div className="result-section">
                    <h3>Recommendations</h3>
                    <ul>
                        <li>Adjust irrigation schedule based on soil moisture levels</li>
                        <li>Monitor for early signs of predicted diseases</li>
                        <li>Consider soil amendments to improve nutrient content</li>
                        <li>Implement crop rotation to prevent soil depletion</li>
                    </ul>
                </div>

            </div>

           
        </div>
    );
};

export default AnalysisResults;