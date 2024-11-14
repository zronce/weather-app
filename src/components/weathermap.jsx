import React, { useState } from 'react';

const WeatherMap = () => {
  const [layer, setLayer] = useState('clouds_new'); // Default layer

  // Use the environment variable for the API key
  const apiKey = import.meta.env.VITE_API_KEY;

  // OpenWeather API URL template
  const baseUrl = `https://tile.openweathermap.org/map/${layer}/{z}/{x}/{y}.png?appid=${apiKey}`;

  // Function to handle layer change
  const handleLayerChange = (event) => {
    setLayer(event.target.value);
  };

  return (
    <div>
      <h1>Weather Map</h1>
      <select onChange={handleLayerChange}>
        <option value="clouds_new">Clouds</option>
        <option value="precipitation_new">Precipitation</option>
        <option value="pressure_new">Sea Level Pressure</option>
        <option value="wind_new">Wind Speed</option>
        <option value="temp_new">Temperature</option>
      </select>
      <div style={{ position: 'relative', width: '100%', height: '500px' }}>
        <img 
          src={baseUrl.replace('{z}', 5).replace('{x}', 10).replace('{y}', 10)} 
          alt="Weather Map" 
          style={{ width: '100%', height: '100%' }} 
        />
      </div>
    </div>
  );
};

export default WeatherMap;
