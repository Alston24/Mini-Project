// weatherController.js — Proxies OpenWeatherMap API calls to the frontend
const {
  getCurrentWeather,
  getForecast,
  getWeatherAlerts,
  geocodeCity,
} = require("../services/openWeatherService");

/**
 * GET /api/weather/current?city= — Returns current weather for a city.
 * @param {import('express').Request} req - Query: { city }
 * @param {import('express').Response} res
 */
const currentWeather = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ message: "City is required" });

    const data = await getCurrentWeather(city);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || error.message,
    });
  }
};

/**
 * GET /api/weather/alerts?city= — Returns weather alerts for a city.
 * @param {import('express').Request} req - Query: { city }
 * @param {import('express').Response} res
 */
const weatherAlerts = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ message: "City is required" });

    const { lat, lon } = await geocodeCity(city);
    const data = await getWeatherAlerts(lat, lon);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || error.message,
    });
  }
};

/**
 * GET /api/weather/forecast?city= — Returns 5-day forecast for a city.
 * @param {import('express').Request} req - Query: { city }
 * @param {import('express').Response} res
 */
const forecast = async (req, res) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ message: "City is required" });

    const data = await getForecast(city);
    res.json(data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: error.response?.data?.message || error.message,
    });
  }
};

module.exports = { currentWeather, weatherAlerts, forecast };
