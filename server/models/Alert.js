// Alert.js — Mongoose schema for weather and seismic alerts
const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  city: { type: String, required: true },
  country: { type: String, default: "" },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  alertType: {
    type: String,
    required: true,
    enum: ["heatwave", "rain", "earthquake", "thunderstorm", "lightning"],
  },
  severity: {
    type: String,
    required: true,
    enum: ["low", "medium", "high", "extreme"],
  },
  temperature: { type: Number, default: null },
  message: { type: String, default: "" },
  source: {
    type: String,
    enum: ["openweathermap", "manual", "usgs"],
    default: "openweathermap",
  },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

// Index for heatmap queries
alertSchema.index({ active: 1, lat: 1, lon: 1 });
// TTL index to auto-expire old alerts (MongoDB removes docs when expiresAt passes)
alertSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Alert = mongoose.model("Alert", alertSchema);
module.exports = { Alert };
