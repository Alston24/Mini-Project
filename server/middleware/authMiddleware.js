// authMiddleware.js — JWT verification middleware for protected routes
const jwt = require("jsonwebtoken");
const { User } = require("../models/User");

/**
 * Verifies the JWT token from the Authorization header.
 * Attaches the user object to req.user if valid.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

/**
 * Restricts access to admin users only. Must be used after protect middleware.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

module.exports = { protect, adminOnly };
