import React, { useState, useEffect } from "react";
import WeatherInfo from "./WeatherInfo";
import WeatherForecast from "./WeatherForecast";
import axios from "axios";
import "./Weather.css";

export default function Weather(props) {
  const [weatherData, setWeatherData] = useState({ ready: false });
  const [city, setCity] = useState(props.defaultCity);
  const [error, setError] = useState(null);

  function handleResponse(response) {
    console.log("API response received successfully:", response);

    // Transform OpenWeatherMap response to match your app's structure
    setWeatherData({
      ready: true,
      coordinates: {
        latitude: response.data.coord.lat,
        longitude: response.data.coord.lon,
      },
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      date: new Date(response.data.dt * 1000),
      description: response.data.weather[0].description,
      icon: mapOpenWeatherIconToSheCodesIcon(response.data.weather[0].icon),
      wind: response.data.wind.speed,
      city: response.data.name,
    });
  }

  // Function to map OpenWeatherMap icons to SheCodes API icon format
  function mapOpenWeatherIconToSheCodesIcon(openWeatherIcon) {
    const mapping = {
      "01d": "clear-sky-day",
      "01n": "clear-sky-night",
      "02d": "few-clouds-day",
      "02n": "few-clouds-night",
      "03d": "scattered-clouds-day",
      "03n": "scattered-clouds-night",
      "04d": "broken-clouds-day",
      "04n": "broken-clouds-night",
      "09d": "shower-rain-day",
      "09n": "shower-rain-night",
      "10d": "rain-day",
      "10n": "rain-night",
      "11d": "thunderstorm-day",
      "11n": "thunderstorm-night",
      "13d": "snow-day",
      "13n": "snow-night",
      "50d": "mist-day",
      "50n": "mist-night",
    };
    return mapping[openWeatherIcon] || "clear-sky-day";
  }

  function handleSubmit(event) {
    event.preventDefault();
    search();
  }

  function handleCityChange(event) {
    setCity(event.target.value);
  }

  function search() {
    console.log("Searching for city:", city);
    // Get your own API key from https://openweathermap.org/api
    const apiKey = "3e7e99a0339b6a1c8aa126a580eedeee";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    console.log("Making API request to:", apiUrl);

    axios
      .get(apiUrl)
      .then((response) => {
        console.log("API call successful");
        handleResponse(response);
      })
      .catch((error) => {
        console.error("API call failed:", error);
        if (error.response) {
          console.error("Error response:", error.response.data);
          console.error("Status code:", error.response.status);
        } else if (error.request) {
          console.error("No response received");
        } else {
          console.error("Error message:", error.message);
        }
        setError("Failed to fetch weather data. Try again later.");
      });
  }

  // Only run once on component mount
  useEffect(() => {
    console.log(
      "Component mounted, performing initial search for:",
      props.defaultCity
    );
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (weatherData.ready) {
    return (
      <div className="Weather">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-9">
              <input
                type="search"
                placeholder="Enter a city"
                className="form-control"
                autoFocus="on"
                onChange={handleCityChange}
              />
            </div>
            <div className="col-3">
              <input
                type="submit"
                value="Search"
                className="btn btn-primary w-100"
              />
            </div>
          </div>
        </form>
        <WeatherInfo data={weatherData} />
        <WeatherForecast coordinates={weatherData.coordinates} />
      </div>
    );
  } else if (error) {
    return (
      <div className="Weather error-container">
        <div className="alert alert-danger">{error}</div>
        <button
          className="btn btn-primary mt-3"
          onClick={() => {
            setError(null);
            search();
          }}
        >
          Try Again
        </button>
      </div>
    );
  } else {
    return (
      <div className="Weather loading-container text-center mt-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading weather data...</p>
      </div>
    );
  }
}
