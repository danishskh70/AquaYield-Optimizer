// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import SoilAnalysisForm from '../components/SoilAnalysisForm'; // Form to submit data
// import Card from '../components/Card'; // Display individual entries as cards

// const CropManagement = () => {
//   const [cards, setCards] = useState([]); // State to store fetched data for cards
//   const [isFormVisible, setIsFormVisible] = useState(false); // To show/hide the form
//   const [loading, setLoading] = useState(true); // Loading state
//   const [error, setError] = useState(null); // Error state
//   const navigate = useNavigate();

//   // Fetch data from the backend when the component mounts
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Use the correct token key: 'authToken'
//         const token = localStorage.getItem('authToken');
//         const response = await axios.get('http://localhost:5000/api/farmers/analyses', {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setCards(response.data); // Set fetched data to state
//       } catch (error) {
//         console.error('Error fetching soil analyses:', error);
//         setError('Failed to fetch soil analyses. Please try again later.');
//       } finally {
//         setLoading(false); // Stop loading once the request finishes
//       }
//     };

//     fetchData();
//   }, []);

//   // Handle form submission to add a new soil analysis
//   const handleFormSubmit = async (formData) => {
//     try {
//       // Use the correct token key: 'authToken'
//       const token = localStorage.getItem('authToken');
//       const response = await axios.post('http://localhost:5000/api/farmers/analyses', formData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Prepend the new card to the beginning of the list
//       setCards((prevCards) => [response.data, ...prevCards]);
//       setIsFormVisible(false); // Close the form after submission
//     } catch (error) {
//       console.error('Error submitting form data:', error);
//       setError('Failed to submit soil analysis. Please try again later.');
//     }
//   };

//   // Toggle form visibility (open/close the form)
//   const toggleFormVisibility = () => {
//     setIsFormVisible(!isFormVisible);
//   };

//   // Render loading or error states
//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div className="dashboard-container">
//       <h1>Soil Analysis Dashboard</h1>

//       {/* Backdrop for blur effect, visible when form is open */}
//       {isFormVisible && <div className="backdrop show" onClick={toggleFormVisibility}></div>}

//       {/* Render submitted cards */}
//       <div className="card-container">
//         {error && <div className="error-message">{error}</div>}

//         {cards.map((data) => (
//           // If the data includes a unique _id, you can use that as key.
//           <div key={data._id || data.id} onClick={() => navigate(`/dashboard/analysis/${data._id || data.id}`, { state: { formData: data } })}>
//             <Card formData={data} />
//           </div>
//         ))}

//         {/* Default Add New Entry card */}
//         <div className="card add-card card-container" onClick={toggleFormVisibility}>
//           <div className="add-symbol">+</div>
//           <p>Add New Entry</p>
//         </div>
//       </div>

//       {/* Show Soil Analysis Form when isFormVisible is true */}
//       {isFormVisible && (
//         <div className="form-modal show">
//           <SoilAnalysisForm closeForm={toggleFormVisibility} onSubmit={handleFormSubmit} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default CropManagement;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SoilAnalysisForm from '../components/SoilAnalysisForm'; // Form to submit soil analysis data
import Card from '../components/Card'; // Display individual entries as cards

const CropManagement = () => {
  const [cards, setCards] = useState([]); // State to store fetched data for cards
  const [isFormVisible, setIsFormVisible] = useState(false); // To show/hide the form
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const navigate = useNavigate();

  // Fetch soil analysis data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/api/farmers/analyses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCards(response.data);
      } catch (error) {
        console.error('Error fetching soil analyses:', error);
        setError('Failed to fetch soil analyses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle submission of a new soil analysis from the form
  const handleFormSubmit = async (formData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('http://localhost:5000/api/farmers/analyses', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Prepend the new card to the list
      setCards((prevCards) => [response.data, ...prevCards]);
      setIsFormVisible(false);
    } catch (error) {
      console.error('Error submitting form data:', error);
      setError('Failed to submit soil analysis. Please try again later.');
    }
  };

  // When a card is clicked, trigger the irrigation-check API using dynamic data and navigate to analysis results
  const handleCardClick = async (data) => {
    try {
      // Retrieve userId and userEmail from localStorage (or from card data if available)
      const storedUserId = localStorage.getItem('userId');
      const storedUserEmail = localStorage.getItem('userEmail');
      
      // Debug: Print the stored userId and userEmail
      console.log("Debug: UserId:", storedUserId, "UserEmail:", storedUserEmail);
      
      // Build the payload dynamically. Divide soil moisture by 100 before sending.
      const payload = {
        current_soil_moisture: data.soilMoisture,
        crop_name: data.cropName,
        age: data.cropAge,
        soil_type: data.soilType,
        latitude: data.latitude,
        longitude: data.longitude,
        mobile_number: storedUserId.startsWith('+91') ? storedUserId : `+91${storedUserId}`,
        email_address: storedUserEmail
      };

      const response = await axios.post('https://alert-and-diseases-backend.onrender.com/irrigation-check', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      // Navigate to the analysis details page with both the card data and the irrigation-check result.
      navigate(`/dashboard/analysis/${data._id || data.id}`, {
        state: { formData: data, irrigationResult: response.data }
      });
    } catch (error) {
      console.error("Error checking irrigation:", error);
      // Navigate to analysis details even if irrigation check fails
      navigate(`/dashboard/analysis/${data._id || data.id}`, { state: { formData: data } });
    }
  };

  // Toggle form visibility (open/close the form)
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard-container1" >
      <h1>Soil Analysis</h1>

      {/* Render analysis cards */}
      <div className="card-container1 ">
        {error && <div className="error-message">{error}</div>}
        {cards.map((data) => (
          <div key={data._id || data.id} onClick={() => handleCardClick(data)}>
            <Card formData={data} />
          </div>
        ))}

        {/* "Add New Entry" card */}
        <div className="card add-card card-container1" onClick={toggleFormVisibility}>
          <div className="add-symbol">+</div>
          <p>Add New Entry</p>
        </div>
      </div>

      {/* Show Soil Analysis Form modal */}
      {isFormVisible && (
        <div className="form-modal show">
           <button className="close-button" onClick={toggleFormVisibility}>×</button>
          <SoilAnalysisForm closeForm={toggleFormVisibility} onSubmit={handleFormSubmit} />
        </div>
      )}
    </div>
  );
};

export default CropManagement;






