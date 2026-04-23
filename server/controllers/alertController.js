// alertController.js — CRUD operations for weather alerts
const { Alert } = require("../models/Alert");

/**
 * GET /api/alerts — Returns all active alerts.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAllAlerts = async (req, res) => {
  try {
    const { type, severity, country, city } = req.query;
    const filter = { active: true };

    if (type) filter.alertType = type;
    if (severity) filter.severity = severity;
    if (country) filter.country = { $regex: country, $options: "i" };
    if (city) filter.city = { $regex: city, $options: "i" };

    const alerts = await Alert.find(filter).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/alerts/heatmap — Returns alerts with lat/lon for heatmap plotting.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getHeatmapData = async (req, res) => {
  try {
    const alerts = await Alert.find({ active: true }).select(
      "lat lon severity alertType city message temperature createdAt"
    );
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/alerts/:id — Returns a single alert by ID.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const getAlertById = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/alerts — Creates a manual alert (admin only).
 * @param {import('express').Request} req - Body: alert fields
 * @param {import('express').Response} res
 */
const createAlert = async (req, res) => {
  try {
    const alert = await Alert.create({ ...req.body, source: "manual" });
    res.status(201).json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * PUT /api/alerts/:id — Updates an existing alert (admin only).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const updateAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json(alert);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * DELETE /api/alerts/:id — Deletes an alert (admin only).
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) return res.status(404).json({ message: "Alert not found" });
    res.json({ message: "Alert deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllAlerts, getHeatmapData, getAlertById,
  createAlert, updateAlert, deleteAlert,
};
