// openWeatherService.js — Wrapper for OpenWeatherMap API calls
const axios = require("axios");

const BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_URL = "https://api.openweathermap.org/geo/1.0";

/**
 * Fetches current weather data for a given city.
 * @param {string} city - City name (e.g. "Mumbai")
 * @returns {Promise<Object>} OpenWeatherMap current weather response
 */
const getCurrentWeather = async (city) => {
  const { data } = await axios.get(`${BASE_URL}/weather`, {
    params: {
      q: city,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
    },
  });
  return data;
};

/**
 * Fetches 5-day / 3-hour forecast for a city.
 * @param {string} city - City name
 * @returns {Promise<Object>} Forecast data with list of entries
 */
const getForecast = async (city) => {
  const { data } = await axios.get(`${BASE_URL}/forecast`, {
    params: {
      q: city,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
    },
  });
  return data;
};

/**
 * Fetches weather alerts using the OneCall API (requires lat/lon).
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise<Object>} OneCall data including alerts array
 */
const getWeatherAlerts = async (lat, lon) => {
  const { data } = await axios.get(`${BASE_URL}/onecall`, {
    params: {
      lat,
      lon,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
      exclude: "minutely,hourly",
    },
  });
  return data;
};

/**
 * Geocodes a city name to get lat/lon coordinates.
 * @param {string} city - City name
 * @returns {Promise<{lat: number, lon: number, country: string}>}
 */
const geocodeCity = async (city) => {
  const { data } = await axios.get(`${GEO_URL}/direct`, {
    params: {
      q: city,
      limit: 1,
      appid: process.env.OPENWEATHER_API_KEY,
    },
  });
  if (!data || data.length === 0) {
    throw new Error(`City not found: ${city}`);
  }
  return { lat: data[0].lat, lon: data[0].lon, country: data[0].country };
};

module.exports = { getCurrentWeather, getForecast, getWeatherAlerts, geocodeCity };
