// userRoutes.js — User profile and subscription route definitions
const express = require("express");
const {
  getProfile, updateProfile, subscribe, unsubscribe,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All user routes are protected
router.use(protect);

// GET /api/users/profile — Get user profile
router.get("/profile", getProfile);

// PUT /api/users/profile — Update profile, saved locations
router.put("/profile", updateProfile);

// POST /api/users/subscribe — Subscribe to alerts for a location
router.post("/subscribe", subscribe);

// DELETE /api/users/subscribe/:city — Unsubscribe from a city
router.delete("/subscribe/:city", unsubscribe);

module.exports = router;
