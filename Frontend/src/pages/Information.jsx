import React from "react";
import '../styles/Information.css';

const Information = () => {
    const soilData = [
        {   
            type: "Red Soil",
            properties: {
                formation: "Formed due to weathering of igneous and metamorphic rocks",
                color: "Reddish due to iron oxides",
                nutrients: "Low in humus, nitrogen, phosphorus, and lime",
                texture: "Light-textured and porous",
                fertility: "Moderate to low (improves with fertilizers)"
            },
            identification: {
                color: "Red/Reddish-brown",
                regions: ["Tamil Nadu", "Karnataka", "Andhra Pradesh", "Odisha", "Madhya Pradesh", "Chhattisgarh"]
            },
            water: {
                capacity: "Low",
                loss: "High",
                irrigation: "Requires frequent irrigation"
            },
            crops: ["Groundnut", "Millets", "Pulses", "Tobacco"]
        },
        {
            type: "Black Soil (Regur)",
            properties: {
                formation: "Formed from weathering of volcanic basalt rocks",
                color: "Black/Dark brown",
                nutrients: "Rich in calcium carbonate, magnesium, potash, and lime",
                texture: "Clayey and sticky",
                fertility: "Naturally fertile, self-plowing"
            },
            identification: {
                color: "Deep black when wet",
                regions: ["Maharashtra", "Gujarat", "Madhya Pradesh", "Karnataka", "Telangana"]
            },
            water: {
                capacity: "Very High",
                loss: "Low",
                irrigation: "Retains moisture for long periods"
            },
            crops: ["Cotton", "Soybean", "Jowar", "Wheat", "Sugarcane"]
        },
        {
            type: "Alluvial Soil",
            properties: {
                formation: "Deposited by rivers (silt, sand, clay)",
                color: "Light gray/Yellow",
                nutrients: "Rich in potash, phosphoric acid, and lime",
                texture: "Loamy to sandy",
                fertility: "Highly fertile"
            },
            identification: {
                color: "Light colored with stratified layers",
                regions: ["Punjab", "Haryana", "Uttar Pradesh", "Bihar", "West Bengal", "Coastal Areas"]
            },
            water: {
                capacity: "Moderate-High",
                loss: "Medium",
                irrigation: "Balanced water retention"
            },
            crops: ["Rice", "Wheat", "Sugarcane", "Pulses", "Oilseeds"]
        }
    ];

    return (
        <div className="main_container">
            {/* Dataset Overview */}
            <section className="dataset-overview mb-12">
                <div className="diagram">
                    <img 
                        src="../assets/USER_page-0001.jpg" 
                        alt="Description of the diagram" 
                        className="rounded-lg shadow-md17" 
                    />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🌾 Irrigation Decision System: Dataset Overview</h2>
                <table className="dataset-table min-w-full border-collapse border border-gray-300 mb-6">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">Feature Name</th>
                            <th className="border border-gray-300 p-2">Description</th>
                            <th className="border border-gray-300 p-2">Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border border-gray-300 p-2">Crop Name</td>
                            <td className="border border-gray-300 p-2">Name of the crop (e.g., Wheat, Rice, Maize, etc.)</td>
                            <td className="border border-gray-300 p-2">-</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Soil Type</td>
                            <td className="border border-gray-300 p-2">Type of soil (e.g., Sandy, Clay, Loamy, etc.)</td>
                            <td className="border border-gray-300 p-2">-</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Moisture Holding Capacity</td>
                            <td className="border border-gray-300 p-2">Maximum water that the soil can retain</td>
                            <td className="border border-gray-300 p-2">mm</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Growth Phase</td>
                            <td className="border border-gray-300 p-2">Current growth stage of the crop</td>
                            <td className="border border-gray-300 p-2">-</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Duration of Phase</td>
                            <td className="border border-gray-300 p-2">Number of days for the current growth phase</td>
                            <td className="border border-gray-300 p-2">days</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Required Irrigation</td>
                            <td className="border border-gray-300 p-2">Amount of irrigation needed per day in this phase</td>
                            <td className="border border-gray-300 p-2">mm/day</td>
                        </tr>
                        <tr>
                            <td className="border border-gray-300 p-2">Optimal Soil Moisture</td>
                            <td className="border border-gray-300 p-2">Recommended soil moisture level for healthy growth</td>
                            <td className="border border-gray-300 p-2">cm³/cm³</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* Rainfall Forecast Section */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🌧️ Calculating Forecasted Rainfall</h2>

            <section className="rainfall-forecast mb-12 mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-2"><strong>1. Data Sources for Rainfall Forecast</strong></h3>
                <p>The system fetches rainfall predictions from <strong>Open-Meteo API</strong> or <strong>NASA SMAP data</strong> for a given <strong>latitude</strong> and <strong>longitude</strong>.</p>
                <p>The API provides precipitation forecasts in <strong>millimeters (mm)</strong>.</p>

                <h3 className="text-xl font-bold text-gray-800 mb-2"><strong>2. Adjusting Forecasted Rainfall for Soil Infiltration</strong></h3>
                <p>Not all forecasted rain contributes to soil moisture; some water <strong>runs off</strong> or <strong>evaporates</strong>.</p>
                <p>We assume a <strong>50% infiltration rate</strong>:</p>
                <p><strong>Effective Rainfall</strong> = Forecasted Rainfall × 0.5</p>
                <p>If the API provides <strong>30 mm</strong> of forecasted rain:</p>
                <p><strong>30 × 0.5 = 15 mm</strong> (effective rain available for soil)</p>

                {/* New Section for Irrigation Needs */}
                <h3 className="text-xl font-bold text-gray-800 mb-4"><strong>3. Determining Whether Irrigation is Needed</strong></h3>
                <h4 className="text-lg font-bold text-gray-800 mb-2"><strong>3.1 Input Parameters Used in the Calculation</strong></h4>
                <ul className="list-disc list-inside mb-4">
                    <li><strong>Current Soil Moisture</strong> (cm³/cm³) - Measured soil moisture before irrigation.</li>
                    <li><strong>Optimal Soil Moisture</strong> (cm³/cm³) - The required soil moisture level for the crop.</li>
                    <li><strong>Required Irrigation per Day</strong> (mm/day) - The water needed for healthy crop growth.</li>
                    <li><strong>Forecasted Effective Rainfall</strong> (mm) - The amount of rain expected to reach the soil.</li>
                </ul>

                {/* New Section for Irrigation Calculation Formula */}
                <h4 className="text-lg font-bold text-gray-800 mb-2"><strong>3.2 Irrigation Calculation Formula</strong></h4>
                <p>To determine if irrigation is needed, we compare the <strong>soil moisture deficit</strong> and the <strong>expected effective rainfall</strong>:</p>

                <h5 className="font-bold mb-2"><strong>1. Calculate Soil Moisture Deficit</strong></h5>
                <p>
                    <strong>Deficit</strong> = (<strong>Optimal Soil Moisture</strong> - <strong>Current Soil Moisture</strong>) × 1000
                </p>
                <p>- This converts <strong>cm³/cm³</strong> to <strong>mm</strong> (water depth).</p>
                <p>- Example: If <strong>Optimal Moisture = 0.40 cm³/cm³</strong> and <strong>Current Moisture = 0.25 cm³/cm³</strong>:</p>
                <p>
                    <strong>(0.40 - 0.25) × 1000 = 150 mm (deficit)</strong>
                </p>

                <h5 className="font-bold mb-2"><strong>2. Compare Deficit with Effective Rainfall</strong></h5>
                <p>- If <strong>Effective Rainfall greater than Deficit </strong>, <strong>no irrigation is needed</strong>.</p>
                <p>- If <strong>Effective Rainfall less than Deficit </strong>, <strong>irrigation is required</strong>.</p>
                <p>- Example:</p>
                <ul className="list-disc list-inside mb-4">
                    <li><strong>Effective Rainfall = 10 mm</strong>, but <strong>Deficit = 150 mm</strong> → <strong>Irrigation needed</strong>.</li>
                    <li><strong>Effective Rainfall = 200 mm</strong>, but <strong>Deficit = 150 mm</strong> → <strong>No irrigation needed</strong>.</li>
                </ul>

                <h5 className="font-bold mb-2"><strong>3. Final Irrigation Requirement Calculation</strong></h5>
                <p>- If irrigation is needed, calculate the water required:</p>
                <p>
                    <strong>Water Needed</strong> = <strong>Deficit</strong> - <strong>Effective Rainfall</strong>
                </p>
                <p>- Example:</p>
                <p>- Deficit = <strong>150 mm</strong>, Effective Rainfall = <strong>10 mm</strong>:</p>
                <p>
                    <strong>150 - 10 = 140 mm (irrigation required)</strong>
                </p>
            </section>

            {/* Sample Scenarios */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">4. Sample Scenarios</h3>
            <div className="flex justify-between mb-6">
                {/* Scenario 1 Card */}
                <div className="scenario-card p-4 border border-gray-300 rounded-lg shadow-md flex-1 mx-2">
                    <h4 className="font-bold mb-2">Scenario 1: Irrigation Required</h4>
                    <table className="min-w-full border-collapse border border-gray-300">
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2">Current Soil Moisture</td>
                                <td className="border border-gray-300 p-2">0.20 cm³/cm³</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Optimal Soil Moisture</td>
                                <td className="border border-gray-300 p-2">0.40 cm³/cm³</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Forecasted Rainfall</td>
                                <td className="border border-gray-300 p-2">20 mm</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Effective Rainfall</td>
                                <td className="border border-gray-300 p-2">10 mm (50% infiltration)</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Soil Moisture Deficit</td>
                                <td className="border border-gray-300 p-2">200 mm</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2"><strong>Irrigation Needed?</strong></td>
                                <td className="border border-gray-300 p-2"><strong>Yes</strong> (200 - 10 = 190 mm required)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Scenario 2 Card */}
                <div className="scenario-card p-4 border border-gray-300 rounded-lg shadow-md flex-1 mx-2">
                    <h4 className="font-bold mb-2">Scenario 2: No Irrigation Needed</h4>
                    <table className="min-w-full border-collapse border border-gray-300">
                        <tbody>
                            <tr>
                                <td className="border border-gray-300 p-2">Current Soil Moisture</td>
                                <td className="border border-gray-300 p-2">0.35 cm³/cm³</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Optimal Soil Moisture</td>
                                <td className="border border-gray-300 p-2">0.40 cm³/cm³</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Forecasted Rainfall</td>
                                <td className="border border-gray-300 p-2">30 mm</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Effective Rainfall</td>
                                <td className="border border-gray-300 p-2">15 mm</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2">Soil Moisture Deficit</td>
                                <td className="border border-gray-300 p-2">50 mm</td>
                            </tr>
                            <tr>
                                <td className="border border-gray-300 p-2"><strong>Irrigation Needed?</strong></td>
                                <td className="border border-gray-300 p-2"><strong>No</strong> (Effective Rainfall covers deficit)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Output Format Section */}
            <h3 className="text-xl font-bold text-gray-800 mb-4">5. Output Format</h3>
            <div className="flex justify-between mb-6">
                {/* Output Card for Irrigation Required */}
                <div className="scenario-card p-4 border border-gray-300 rounded-lg shadow-md flex-1 mx-2">
                    <h4 className="font-bold mb-2">Case: Irrigation Required</h4>
                    <pre className="bg-gray-100 p-2 rounded-md">
                        {`{
  "irrigation_required": true,
  "water_needed": 140,
  "precipitation_forecast": 20,
  "alert_status": "sent"
}`}
                    </pre>
                </div>

                {/* Output Card for No Irrigation Required */}
                <div className="scenario-card p-4 border border-gray-300 rounded-lg shadow-md flex-1 mx-2">
                    <h4 className="font-bold mb-2">Case: No Irrigation Required</h4>
                    <pre className="bg-gray-100 p-2 rounded-md">
                        {`{
  "irrigation_required": false,
  "water_needed": 0,
  "precipitation_forecast": 30,
  "alert_status": "not sent"
}`}
                    </pre>
                </div>
            </div>

            {/* Enhanced Soil Types Section */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🌱 Major Soil Types in India</h2>
                
                <div className="soil-map mb-8">
                    <img 
                        src="https://geography4u.com/wp-content/uploads/2020/05/Major-soils-in-india-scaled.jpg" 
                        alt="Indian Soil Map" 
                        className="rounded-lg shadow-md"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {soilData.map((soil, index) => (
                        <div key={index} className="soil-card p-6 bg-white rounded-xl shadow-lg">
                            <h3 className="text-xl font-bold mb-4 text-gray-800">{soil.type}</h3>
                            
                            <div className="soil-property mb-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Properties</h4>
                                <ul className="list-disc list-inside text-gray-600">
                                    <li>{soil.properties.formation}</li>
                                    <li>Color: {soil.properties.color}</li>
                                    <li>Texture: {soil.properties.texture}</li>
                                    <li>Nutrients: {soil.properties.nutrients}</li>
                                </ul>
                            </div>

                            <div className="soil-identification mb-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Identification</h4>
                                <ul className="list-disc list-inside text-gray-600">
                                    <li>Color: {soil.identification.color}</li>
                                    <li>Found in: {soil.identification.regions.join(', ')}</li>
                                </ul>
                            </div>

                            <div className="water-info mb-4">
                                <h4 className="font-semibold text-gray-700 mb-2">Water Characteristics</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-sm">💧 Capacity</span>
                                        <p className="font-medium">{soil.water.capacity}</p>
                                    </div>
                                    <div>
                                        <span className="text-sm">⏳ Loss Rate</span>
                                        <p className="font-medium">{soil.water.loss}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="crops-info">
                                <h4 className="font-semibold text-gray-700 mb-2">🌾 Ideal Crops</h4>
                                <div className="flex flex-wrap gap-2">
                                    {soil.crops.map((crop, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                                            {crop}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Enhanced Comparison Table */}
                <h3 className="text-xl font-bold text-gray-800 mb-4">Comparative Analysis</h3>
                <table className="comparison-table w-full border-collapse rounded-lg overflow-hidden shadow-lg">
                    <thead className="bg-gray-50">
                        <tr>
                            {["Soil Type", "Formation", "Color", "Texture", "Water Capacity", "Moisture Loss", "Key Regions", "Major Crops"].map((header, idx) => (
                                <th key={idx} className="p-3 text-left text-sm font-semibold text-gray-700">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {soilData.map((soil, index) => (
                            <tr key={index} className="border-t border-gray-100 hover:bg-gray-50">
                                <td className="p-3">{soil.type}</td>
                                <td className="p-3">{soil.properties.formation}</td>
                                <td className="p-3">{soil.properties.color}</td>
                                <td className="p-3">{soil.properties.texture}</td>
                                <td className="p-3">{soil.water.capacity}</td>
                                <td className="p-3">{soil.water.loss}</td>
                                <td className="p-3">{soil.identification.regions.slice(0, 3).join(', ')}...</td>
                                <td className="p-3">{soil.crops.slice(0, 3).join(', ')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Enhanced Conclusion */}
                <div className="conclusion-card mt-8 p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Key Characteristics</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            <strong>Red Soil:</strong> Quick-drying, needs frequent irrigation • Best for drought-resistant crops
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-gray-800 rounded-full mr-2"></span>
                            <strong>Black Soil:</strong> Self-aerating cracks • Excellent moisture retention • Cotton's preferred base
                        </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                            <strong>Alluvial Soil:</strong> River-deposited fertility • Balanced drainage • Supports multiple cropping
                        </li>
                    </ul>
                    <div className="conclusion-card mt-8 p-6 bg-blue-50 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-3">Resources</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            <strong>Link 1 :</strong> <a href="https://www.agricultureinindia.net/irrigation-2/crop-water-requirement/crop-water-requirement-for-different-crops-in-india/18980">Agricultureinindia.net</a>
                            </li>
                        <li className="flex items-center">
                            <span className="w-2 h-2 bg-gray-800 rounded-full mr-2"></span>
                            <strong>Link 2 :</strong>  <a href="http://ecoursesonline.iasri.res.in/Courses/Water%20Management%20including%20Micro%20Irrigation/AGRO103/Data%20Files/lec07.pdf0">Water Management pdf</a>
                            </li>
                         
                    </ul>
                </div>
                </div>
            </section>
        </div>
    );
};

export default Information;