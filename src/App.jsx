import React from "react";
import { useState, useEffect } from "react";
import "./App.css";
import PropTypes from 'prop-types';


import searchIcon from "./assets/search.png";
import humidityIcon from "./assets/humidity.png";
import clearIcon from "./assets/sun.png";
import cloudIcon from "./assets/cloud.png";
import windIcon from "./assets/wind.png";
import drizzleIcon from "./assets/drizzle.png";
import rainIcon from "./assets/rain.png";
import snowIcon from "./assets/snow.png";

const WeatherDetails = ({
  icon,
  temp,
  city,
  country,
  lat,
  lon,
  humidity,
  wind,
}) => {
  return (
    <>
      <div className="image">
        <img src={icon} alt="Icon" width="150px" />
      </div>
      <div className="temp">{temp} ℃</div>
      <div className="city">{city}</div>
      <div className="country">{country}</div>

      <div className="coordinates">
        <div>
          <span className="latitude">Latitude</span>
          <span>{lat}</span>
        </div>
        <div>
          <span className="longitude">Longitude</span>
          <span>{lon}</span>
        </div>
      </div>

      <div className="data-container">
        <div className="humidity">
          <img
            src={humidityIcon}
            alt="humidity"
            className="icon"
            width="80px"
          />
          <div className="data">
            <div className="percentage">{humidity}%</div>
            <div className="text">Humidity</div>
          </div>
        </div>
        <div className="wind">
          <img src={windIcon} alt="wind" className="icon" width="80px" />
          <div className="data">
            <div className="percentage">{wind} km/h</div>{" "}
            {/*class name for styling only */}
            <div className="text">Wind speed</div>
          </div>
        </div>
      </div>
    </>
  );
};

WeatherDetails.propTypes={
  icon: PropTypes.string.isRequired,
  temp: PropTypes.number.isRequired,
  city: PropTypes.string.isRequired,
  country: PropTypes.string.isRequired,
  humidity: PropTypes.number.isRequired,
  wind: PropTypes.number.isRequired,
  lon: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
}

function App() {
  const [text, setText] = useState("Jaffna");
  const [icon, setIcon] = useState(clearIcon);
  const [temp, setTemp] = useState(0);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [lat, setLatitude] = useState(0);
  const [lon, setLongitude] = useState(0);
  const [humidity, setHumidity] = useState(0);
  const [wind, setWind] = useState(0);

  const [citynotfound, setCityNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const weatherIconMap = {
    "01d": clearIcon,
    "01n": clearIcon,
    "02d": cloudIcon,
    "02n": cloudIcon,
    "03d": drizzleIcon,
    "03n": drizzleIcon,
    "04d": drizzleIcon,
    "04n": drizzleIcon,
    "09d": rainIcon,
    "09n": rainIcon,
    "10d": rainIcon,
    "10n": rainIcon,
    "13d": snowIcon,
    "13n": snowIcon,
  };

let api_key = "731d16b9ca38ab4db48f1b757d605d10";
const search = async () => {
  try {
    setLoading(true);
    setError(null);

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${api_key}&units=metric`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.cod == "404") {
      setCityNotFound(true);
      return;
    }

    setHumidity(data.main.humidity);
    setWind(data.wind.speed);
    setTemp(Math.floor(data.main.temp));
    setCity(data.name);
    setCountry(data.sys.country);
    setLatitude(data.coord.lat);
    setLongitude(data.coord.lon);

    const weatherIconCode = data.weather[0].icon;
    setIcon(weatherIconMap[weatherIconCode] || clearIcon);
    setCityNotFound(false);
  } catch (error) {
    console.error("Fetch error:", error);
    setError("An error occurred while fetching data.");
  } finally {
    setLoading(false);
  }
};

  const handleCity = (e) => {
    setText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search();
    }
  };

  useEffect(function () {
    search();
  }, []);

  return (
    <>
      <div className="container">
        <div className="input-container">
          <input
            type="text"
            className="cityInput"
            placeholder="Enter the city name"
            onChange={handleCity}
            value={text}
            onKeyDown={handleKeyDown}
          />
          {/* value : search box la display default city */}

          <div className="search-icon">
            <img
              src={searchIcon}
              alt="Search"
              width="28px"
              onClick={() => search()}
            />
          </div>
        </div>

        {loading && <div className="loading-message">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        {citynotfound &&<div className="city-not-found">City not Found</div>}

        {!loading && !citynotfound && <WeatherDetails
          icon={icon}
          temp={temp}
          city={city}
          country={country}
          lat={lat}
          lon={lon}
          humidity={humidity}
          wind={wind}
        />}

        <p>
          Designed by <span>Thivision</span>
        </p>
      </div>
    </>
  );
}

export default App;
