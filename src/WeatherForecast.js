import React, { useState, useEffect } from "react";
import "./WeatherForecast.css";
import axios from "axios";
import WeatherForecastDay from "./WeatherForecastDay";

export default function WeatherForecast(props) {
  let [loaded, setLoaded] = useState(false);
  let [forecast, setForecast] = useState(null);

  useEffect(() => {
    setLoaded(false);
  }, [props.coordinates]);

  useEffect(() => {
    if (!loaded && props.coordinates) {
      load();
    }
  }, [loaded, props.coordinates]);

  function handleResponse(response) {
    console.log("Forecast API response:", response);

    // Process and transform the daily forecast data
    const forecastData = response.data.list
      // Group by day (OpenWeatherMap returns 3-hour forecasts)
      .filter((item, index) => index % 8 === 0) // Take one forecast per day (every 8th item = 24 hours)
      .map((item) => ({
        // Transform to match SheCodes API structure expected by WeatherForecastDay
        time: item.dt,
        temperature: {
          maximum: item.main.temp_max,
          minimum: item.main.temp_min,
        },
        condition: {
          icon: mapOpenWeatherIconToSheCodesIcon(item.weather[0].icon),
        },
      }));

    setForecast(forecastData);
    setLoaded(true);
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

  function load() {
    // Get your own API key from https://openweathermap.org/api
    let apiKey = "1d038ee28ef2ad25c57974aa6749dad5";
    let latitude = props.coordinates.latitude;
    let longitude = props.coordinates.longitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

    console.log("Forecast API URL:", apiUrl);

    axios
      .get(apiUrl)
      .then(handleResponse)
      .catch((error) => {
        console.error("Error fetching forecast data:", error);
      });
  }

  if (loaded && forecast) {
    return (
      <div className="WeatherForecast">
        <div className="row">
          {forecast.map(function (dailyForecast, index) {
            if (index < 5) {
              return (
                <div className="col" key={index}>
                  <WeatherForecastDay data={dailyForecast} />
                </div>
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="WeatherForecast text-center">
        <div className="spinner-border spinner-border-sm" role="status">
          <span className="visually-hidden">Loading forecast...</span>
        </div>
      </div>
    );
  }
}
