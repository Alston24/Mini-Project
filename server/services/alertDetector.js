// alertDetector.js — Automated alert detection logic, runs on cron schedule
const cron = require("node-cron");
const { Alert } = require("../models/Alert");
const { getCurrentWeather } = require("./openWeatherService");
const { getRecentEarthquakes, magnitudeToSeverity } = require("./earthquakeService");

// Cities to monitor for weather alerts (expand as needed)
const MONITORED_CITIES = [
  "Mumbai", "Delhi", "Tokyo", "New York", "London",
  "Sydney", "Cairo", "Dubai", "Singapore", "São Paulo",
  "Los Angeles", "Paris", "Moscow", "Beijing", "Lagos",
  "Jakarta", "Istanbul", "Bangkok", "Berlin", "Toronto",
];

/**
 * Analyzes weather data and creates alerts based on threshold rules.
 * @param {Object} weather - OpenWeatherMap current weather response
 * @param {string} city - City name
 * @returns {Array<Object>} Array of alert objects to save
 */
const detectWeatherAlerts = (weather, city) => {
  const alerts = [];
  const temp = weather.main?.temp;
  const condition = weather.weather?.[0]?.main || "";
  const rain = weather.rain?.["1h"] || 0;
  const lat = weather.coord?.lat;
  const lon = weather.coord?.lon;
  const country = weather.sys?.country || "";
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  if (temp > 40) {
    alerts.push({
      city, country, lat, lon,
      alertType: "heatwave", severity: "extreme", temperature: temp,
      message: `Extreme heatwave: ${temp}°C in ${city}`,
      source: "openweathermap", active: true, expiresAt: expiry,
    });
  } else if (temp > 35) {
    alerts.push({
      city, country, lat, lon,
      alertType: "heatwave", severity: "high", temperature: temp,
      message: `Heatwave warning: ${temp}°C in ${city}`,
      source: "openweathermap", active: true, expiresAt: expiry,
    });
  }

  if (condition.toLowerCase().includes("thunderstorm")) {
    alerts.push({
      city, country, lat, lon,
      alertType: "thunderstorm", severity: "high",
      message: `Thunderstorm alert in ${city}`,
      source: "openweathermap", active: true, expiresAt: expiry,
    });
  }

  if (condition.toLowerCase().includes("lightning")) {
    alerts.push({
      city, country, lat, lon,
      alertType: "lightning", severity: "medium",
      message: `Lightning detected in ${city}`,
      source: "openweathermap", active: true, expiresAt: expiry,
    });
  }

  if (rain > 50) {
    alerts.push({
      city, country, lat, lon,
      alertType: "rain", severity: "high",
      message: `Heavy rain: ${rain}mm/hr in ${city}`,
      source: "openweathermap", active: true, expiresAt: expiry,
    });
  } else if (rain > 20) {
    alerts.push({
      city, country, lat, lon,
      alertType: "rain", severity: "medium",
      message: `Moderate rain: ${rain}mm/hr in ${city}`,
      source: "openweathermap", active: true, expiresAt: expiry,
    });
  }

  return alerts;
};

/**
 * Checks weather for all monitored cities and creates alerts.
 */
const checkWeatherAlerts = async () => {
  console.log("🔍 Running alert detection...");
  try {
    for (const city of MONITORED_CITIES) {
      try {
        const weather = await getCurrentWeather(city);
        const alerts = detectWeatherAlerts(weather, city);
        for (const alert of alerts) {
          await Alert.findOneAndUpdate(
            { city: alert.city, alertType: alert.alertType, active: true },
            alert,
            { upsert: true, returnDocument: 'after' }
          );
        }
      } catch (err) {
        console.error(`⚠️ Failed to check ${city}: ${err.message}`);
      }
    }

    // Check earthquakes
    const quakes = await getRecentEarthquakes(20);
    for (const quake of quakes) {
      const severity = magnitudeToSeverity(quake.magnitude);
      await Alert.findOneAndUpdate(
        { lat: quake.lat, lon: quake.lon, alertType: "earthquake", active: true },
        {
          city: quake.place, country: "", lat: quake.lat, lon: quake.lon,
          alertType: "earthquake", severity, temperature: null,
          message: `Earthquake M${quake.magnitude} near ${quake.place}`,
          source: "usgs", active: true,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        { upsert: true, returnDocument: 'after' }
      );
    }

    console.log("✅ Alert detection complete");
  } catch (error) {
    console.error("❌ Alert detection failed:", error.message);
  }
};

/**
 * Starts the cron job to check alerts every 10 minutes.
 */
const startAlertCron = () => {
  // Run immediately on server start
  checkWeatherAlerts();
  // Then every 10 minutes
  cron.schedule("*/10 * * * *", () => {
    checkWeatherAlerts();
  });
  console.log("⏰ Alert detection cron scheduled (every 10 min)");
};

module.exports = { startAlertCron, checkWeatherAlerts, detectWeatherAlerts };
