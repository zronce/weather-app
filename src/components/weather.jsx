import { useEffect, useState } from 'react';
import React from 'react';
import './weather.css';
import { FiSearch } from 'react-icons/fi';
import { WiDayCloudy, WiCloudy, WiRain, WiThunderstorm, WiSnow, WiDaySunny, WiNightClear, WiDaySunnyOvercast, WiFog, WiCloudyWindy, WiHumidity, WiBarometer, WiStrongWind, WiDust, WiTornado } from "react-icons/wi";
import Notification from './Notification';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [hourlyData, setHourlyData] = useState([]);
  const [inputCity, setInputCity] = useState("");
  const [showNotification, setShowNotification] = useState(false);

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '200': case '201': case '202': case '210': case '211': case '212': case '221': case '230': case '231': case '232':
        return <WiThunderstorm size={200} />;
      case '300': case '301': case '302': case '310': case '311': case '312': case '313': case '314': case '321':
        return <WiRain size={200} />;
      case '500': case '501': case '502': case '503': case '504':
        return <WiRain size={200} />;
      case '511':
        return <WiSnow size={200} />;
      case '520': case '521': case '522': case '531':
        return <WiRain size={200} />;
      case '600': case '601': case '602': case '620': case '621': case '622':
        return <WiSnow size={200} />;
      case '611': case '612': case '613': case '615': case '616':
        return <WiCloudy size={200} />;
      case '701': case '741':
        return <WiFog size={200} />;
      case '711':
        return <WiDust size={200} />;
      case '721':
        return <WiDaySunnyOvercast size={200} />;
      case '731': case '751': case '761': case '762':
        return <WiDust size={200} />;
      case '771':
        return <WiCloudyWindy size={200} />;
      case '781':
        return <WiTornado size={200} />;
      case '800':
        return <WiDaySunny size={200} />;
      case '801':
        return <WiDaySunnyOvercast size={200} />;
      case '802':
        return <WiCloudy size={200} />;
      case '803':
      case '804':
        return <WiCloudyWindy size={200} />;
      default:
        return <WiDayCloudy size={200} />;
    }
  };

  const fetchWeather = async (cityOrCoords) => {
    try {
      const url = typeof cityOrCoords === 'string'
        ? `https://api.openweathermap.org/data/2.5/weather?q=${cityOrCoords}&appid=${import.meta.env.VITE_API_KEY}&units=metric`
        : `https://api.openweathermap.org/data/2.5/weather?lat=${cityOrCoords.lat}&lon=${cityOrCoords.lon}&appid=${import.meta.env.VITE_API_KEY}&units=metric`;

      const response = await fetch(url);
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
        setShowNotification(false);

        // Fetch hourly forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${import.meta.env.VITE_API_KEY}&units=metric`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        setHourlyData(forecastData.list.slice(0, 5)); // Get the next 5 intervals (15 hours)
      } else {
        setWeatherData(null);
        setShowNotification(true);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };
        fetchWeather(coords);
      },
      (error) => {
        console.error("Geolocation not available or denied:", error);
        fetchWeather("Manila");
      }
    );
  }, []);

  const handleSearch = () => {
    fetchWeather(inputCity);
  };

  const closeNotification = () => {
    setShowNotification(false);
  };

  return (
    <div className='weather'>
      <div className='search-bar'>
        <input
          type="text"
          placeholder='Search city'
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
          <div className='weather-icon'>
            {getWeatherIcon(weatherData.icon)}
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

          <div className='hourly-forecast'>
            <h3>3-Hour Forecast</h3>
            {hourlyData.map((forecast, index) => (
              <div key={index} className='forecast-item'>
                <p>{new Date(forecast.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                {getWeatherIcon(forecast.weather[0].id.toString())}
                <p>{forecast.main.temp}°C</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="no-data">No weather data available</p>
      )}

      {showNotification && <Notification message="City not found!" onClose={closeNotification} />}
    </div>
  );
};

export default Weather;
