// server.js — Main entry point for the Aqify Express server
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");
const { startAlertCron } = require("./services/alertDetector");

const authRoutes = require("./routes/authRoutes");
const alertRoutes = require("./routes/alertRoutes");
const weatherRoutes = require("./routes/weatherRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/users", userRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Global error handler
app.use(errorHandler);

/**
 * Starts the server and connects to MongoDB.
 * Also kicks off the cron-based alert detection.
 */
const startServer = async () => {
  await connectDB();
  startAlertCron();
  app.listen(PORT, () => {
    console.log(`🚀 Aqify server running on port ${PORT}`);
  });
};

startServer();
