// authRoutes.js — Authentication route definitions
const express = require("express");
const { register, login, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// POST /api/auth/register — Create new user account
router.post("/register", register);

// POST /api/auth/login — Login, return JWT
router.post("/login", login);

// GET /api/auth/me — Get current user (protected)
router.get("/me", protect, getMe);

module.exports = router;
