// userController.js — Handles user profile and alert subscription management
const { User } = require("../models/User");
const { Subscription } = require("../models/Subscription");
const { geocodeCity } = require("../services/openWeatherService");

/**
 * GET /api/users/profile — Returns the authenticated user's profile.
 * @param {import('express').Request} req - req.user from auth middleware
 * @param {import('express').Response} res
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT /api/users/profile — Updates user profile and saved locations.
 * @param {import('express').Request} req - Body: { name, alertPreferences, savedLocations }
 * @param {import('express').Response} res
 */
const updateProfile = async (req, res) => {
  try {
    const { name, alertPreferences, savedLocations } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (alertPreferences) user.alertPreferences = alertPreferences;
    if (savedLocations) user.savedLocations = savedLocations;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * POST /api/users/subscribe — Subscribe to alerts for a city.
 * @param {import('express').Request} req - Body: { city, alertTypes }
 * @param {import('express').Response} res
 */
const subscribe = async (req, res) => {
  try {
    const { city, alertTypes } = req.body;
    if (!city) return res.status(400).json({ message: "City is required" });

    const { lat, lon } = await geocodeCity(city);

    const subscription = await Subscription.findOneAndUpdate(
      { userId: req.user._id, city },
      { userId: req.user._id, city, lat, lon, alertTypes, active: true },
      { upsert: true, new: true }
    );

    // Also add to saved locations
    const user = await User.findById(req.user._id);
    const alreadySaved = user.savedLocations.some(
      (loc) => loc.city.toLowerCase() === city.toLowerCase()
    );
    if (!alreadySaved) {
      user.savedLocations.push({ city, lat, lon });
      await user.save();
    }

    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE /api/users/subscribe/:city — Unsubscribe from a city's alerts.
 * @param {import('express').Request} req - Params: { city }
 * @param {import('express').Response} res
 */
const unsubscribe = async (req, res) => {
  try {
    const { city } = req.params;

    await Subscription.findOneAndDelete({
      userId: req.user._id,
      city: { $regex: new RegExp(`^${city}$`, "i") },
    });

    // Remove from saved locations
    const user = await User.findById(req.user._id);
    user.savedLocations = user.savedLocations.filter(
      (loc) => loc.city.toLowerCase() !== city.toLowerCase()
    );
    await user.save();

    res.json({ message: `Unsubscribed from ${city}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile, subscribe, unsubscribe };
