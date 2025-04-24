import React from "react";
import "./Weather.css";

export default function Weather() {
  return (
    <div className="Weather">
      <form>
        <div className="row">
          <div className="col-9">
            <input
              type="search"
              placeholder="Enter a city"
              className="form-control"
              autoFocus="on"
            />
          </div>
          <div className="col-3">
            <input type="submit" value="Search" className="btn btn-primary" />
          </div>
        </div>
      </form>

      <h1>Chicago</h1>
      <ul>
        <li>Thursday 4:00</li>
        <li>Partly cloudy</li>
      </ul>

      <div className="row">
        <div className="col-6">
          <img
            src="https://ssl.gstatic.com/onebox/weather/64/partly_cloudy.png"
            alt="Partly Cloudy"
          />
          <span className="temperature">56</span>
          <span className="unit">°F</span>
        </div>
        <div className="col-6">
          <ul>
            <li>Precipitation: 0%</li>
            <li>Humidity: 65%</li>
            <li>Wind: 9 mph</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
