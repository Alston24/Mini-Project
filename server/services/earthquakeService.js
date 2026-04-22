// earthquakeService.js — Fetches recent earthquake data from USGS API
const axios = require("axios");

const USGS_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query";

/**
 * Fetches recent earthquakes with magnitude >= 4.0 from USGS.
 * @param {number} limit - Max number of results (default 20)
 * @returns {Promise<Array<{lat, lon, magnitude, place, time}>>} Parsed earthquake data
 */
const getRecentEarthquakes = async (limit = 20) => {
  try {
    const { data } = await axios.get(USGS_URL, {
      params: {
        format: "geojson",
        minmagnitude: 4.0,
        limit,
        orderby: "time",
      },
    });

    return data.features.map((feature) => ({
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      magnitude: feature.properties.mag,
      place: feature.properties.place || "Unknown",
      time: new Date(feature.properties.time),
    }));
  } catch (error) {
    console.error("❌ USGS API error:", error.message);
    return [];
  }
};

/**
 * Converts earthquake magnitude to alert severity.
 * @param {number} magnitude - Richter scale magnitude
 * @returns {"low"|"medium"|"high"|"extreme"} Severity level
 */
const magnitudeToSeverity = (magnitude) => {
  if (magnitude >= 7.0) return "extreme";
  if (magnitude >= 6.0) return "high";
  if (magnitude >= 5.0) return "medium";
  return "low";
};

module.exports = { getRecentEarthquakes, magnitudeToSeverity };
