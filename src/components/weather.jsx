import React, { useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import { WiHumidity, WiBarometer, WiStrongWind } from "react-icons/wi";
import Notification from './Notification';
import './weather.css';
import { WiDayCloudy, WiCloudy, WiRain, WiThunderstorm, WiSnow, WiDaySunny, WiDaySunnyOvercast, WiFog, WiCloudyWindy, WiDust, WiTornado } from "react-icons/wi";

const getWeatherIcon = (iconCode, size = 50) => {
  switch (iconCode) {
    case '200': case '201': case '202': case '210': case '211': case '212': case '221': case '230': case '231': case '232':
      return <WiThunderstorm size={size} />;
    case '300': case '301': case '302': case '310': case '311': case '312': case '313': case '314': case '321':
    case '500': case '501': case '502': case '503': case '504':
    case '520': case '521': case '522': case '531':
      return <WiRain size={size} />;
    case '511':
      return <WiSnow size={size} />;
    case '600': case '601': case '602': case '620': case '621': case '622':
      return <WiSnow size={size} />;
    case '701': case '741':
      return <WiFog size={size} />;
    case '711':
      return <WiDust size={size} />;
    case '721':
      return <WiDaySunnyOvercast size={size} />;
    case '731': case '751': case '761': case '762':
      return <WiDust size={size} />;
    case '771':
      return <WiCloudyWindy size={size} />;
    case '781':
      return <WiTornado size={size} />;
    case '800':
      return <WiDaySunny size={size} />;
    case '801':
      return <WiDaySunnyOvercast size={size} />;
    case '802':
      return <WiCloudy size={size} />;
    case '803': case '804':
      return <WiCloudyWindy size={size} />;
    default:
      return <WiDayCloudy size={size} />;
  }
};

const airQualityDescription = (aqi) => {
  if (aqi === 1) return "Good";
  if (aqi === 2) return "Fair";
  if (aqi === 3) return "Moderate";
  if (aqi === 4) return "Poor";
  if (aqi === 5) return "Very Poor";
  return "Unknown";
};

const WeatherApp = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [inputCity, setInputCity] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [isForecastVisible, setIsForecastVisible] = useState(false);

  const fetchWeather = async (city) => {
    try {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_API_KEY}&units=metric`;
      const response = await fetch(weatherUrl);
      const data = await response.json();

      if (data.cod === 200) {
        setWeatherData({
          city: data.name,
          country: data.sys.country,
          temp: data.main.temp,
          icon: data.weather[0].id.toString(),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          wind: data.wind.speed,
        });
        fetchForecast(data.coord.lat, data.coord.lon);
        fetchAirQuality(data.coord.lat, data.coord.lon);
        setShowNotification(false);
      } else {
        setWeatherData(null);
        setShowNotification(true);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  const fetchForecast = async (lat, lon) => {
    try {
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}&units=metric`;
      const response = await fetch(forecastUrl);
      const data = await response.json();
      setForecastData(data.list.slice(0, 5));
    } catch (error) {
      console.error("Error fetching forecast data:", error);
    }
  };

  const fetchAirQuality = async (lat, lon) => {
    try {
      const airQualityUrl = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${import.meta.env.VITE_API_KEY}`;
      const response = await fetch(airQualityUrl);
      const data = await response.json();
      setAirQualityData(data.list[0].main.aqi); // Get the air quality index (AQI)
    } catch (error) {
      console.error("Error fetching air quality data:", error);
    }
  };

  useEffect(() => {
    fetchWeather("Manila");
  }, []);

  const handleSearch = () => {
    fetchWeather(inputCity);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  const toggleForecastVisibility = () => {
    setIsForecastVisible(prevState => !prevState);
  };

  return (
    <div className='weather-app'>
      <div className='search-bar'>
        <input
          type="text"
          placeholder='Search City'
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <FiSearch className='search-icon' onClick={handleSearch} />
      </div>

      {weatherData ? (
        <>
          <div className='weather'>
            <div className='weather-icon'>
              {getWeatherIcon(weatherData.icon, 200)}
            </div>
            <p className='temp'>{weatherData.temp}°C</p>
            <p className='city'>{weatherData.city}, {weatherData.country}</p>
            <p className='description'>{weatherData.description}</p>

            <div className='weather-data'>
              <div className='col'>
                <WiHumidity size={50} />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className='col'>
                <WiBarometer size={50} />
                <div>
                  <p>{weatherData.pressure} hPa</p>
                  <span>Pressure</span>
                </div>
              </div>
              <div className='col'>
                <WiStrongWind size={50} />
                <div>
                  <p>{weatherData.wind} m/s</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </div>

          {airQualityData !== null && (
            <div className='air-quality'>
              <p>Air Quality Index: {airQualityDescription(airQualityData)}</p>
            </div>
          )}

          <div className='forecast-section'>
            <button className='toggle-forecast' onClick={toggleForecastVisibility}>
              {isForecastVisible ? "Hide Forecast" : "Show 5 Day Forecast"}
            </button>
            {isForecastVisible && (
              <div className='forecast'>
                {forecastData ? (
                  forecastData.map((forecast, index) => (
                    <div key={index} className='forecast-item'>
                      <p>{new Date(forecast.dt * 1000).toLocaleString()}</p>
                      {getWeatherIcon(forecast.weather[0].id.toString())}
                      <p className='temp'>{forecast.main.temp}°C</p>
                      <p className='description'>{forecast.weather[0].description}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-data">No forecast data available</p>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="no-data">No weather data available</p>
      )}

      {showNotification && <Notification message="City not found!" onClose={closeNotification} />}
    </div>
  );
};

export default WeatherApp;
