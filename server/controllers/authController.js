// authController.js — Handles user registration, login, and profile retrieval
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

/**
 * Generates a JWT token for a given user ID.
 * @param {string} id - MongoDB user ID
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

/**
 * POST /api/auth/register — Creates a new user account.
 * @param {import('express').Request} req - Body: { name, email, password }
 * @param {import('express').Response} res
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST /api/auth/login — Authenticates user and returns JWT.
 * @param {import('express').Request} req - Body: { email, password }
 * @param {import('express').Response} res
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET /api/auth/me — Returns the currently authenticated user.
 * @param {import('express').Request} req - req.user set by auth middleware
 * @param {import('express').Response} res
 */
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, getMe };
