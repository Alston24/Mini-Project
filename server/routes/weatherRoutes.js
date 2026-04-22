// weatherRoutes.js — Weather data route definitions (proxied from OpenWeatherMap)
const express = require("express");
const { currentWeather, weatherAlerts, forecast } = require("../controllers/weatherController");

const router = express.Router();

// GET /api/weather/current?city= — Fetch current weather for a city
router.get("/current", currentWeather);

// GET /api/weather/alerts?city= — Fetch OWM weather alerts for a city
router.get("/alerts", weatherAlerts);

// GET /api/weather/forecast?city= — Fetch 5-day forecast
router.get("/forecast", forecast);

module.exports = router;
