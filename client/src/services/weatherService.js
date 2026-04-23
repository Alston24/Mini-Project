// weatherService.js — API calls for weather data (current, forecast, alerts)
import { api } from "./api";

/**
 * Fetches current weather for a given city.
 * @param {string} city - City name
 * @returns {Promise<Object>} OpenWeatherMap weather data
 */
export const getCurrentWeather = async (city) => {
  const { data } = await api.get("/weather/current", { params: { city } });
  return data;
};

/**
 * Fetches 5-day forecast for a city.
 * @param {string} city - City name
 * @returns {Promise<Object>} Forecast data with list entries
 */
export const getForecast = async (city) => {
  const { data } = await api.get("/weather/forecast", { params: { city } });
  return data;
};

/**
 * Fetches weather alerts for a city.
 * @param {string} city - City name
 * @returns {Promise<Object>} Weather alerts data
 */
export const getWeatherAlerts = async (city) => {
  const { data } = await api.get("/weather/alerts", { params: { city } });
  return data;
};
