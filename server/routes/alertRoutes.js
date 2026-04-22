// alertRoutes.js — Alert CRUD route definitions
const express = require("express");
const {
  getAllAlerts, getHeatmapData, getAlertById,
  createAlert, updateAlert, deleteAlert,
} = require("../controllers/alertController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/alerts — Get all active alerts (public)
router.get("/", getAllAlerts);

// GET /api/alerts/heatmap — Get alerts for heatmap (public)
router.get("/heatmap", getHeatmapData);

// GET /api/alerts/:id — Get single alert (public)
router.get("/:id", getAlertById);

// POST /api/alerts — Create manual alert (admin only)
router.post("/", protect, adminOnly, createAlert);

// PUT /api/alerts/:id — Update alert (admin only)
router.put("/:id", protect, adminOnly, updateAlert);

// DELETE /api/alerts/:id — Delete alert (admin only)
router.delete("/:id", protect, adminOnly, deleteAlert);

module.exports = router;
