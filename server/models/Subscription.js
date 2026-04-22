// Subscription.js — Mongoose schema for user alert subscriptions per city
const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    alertTypes: {
      type: [String],
      enum: ["heatwave", "rain", "earthquake", "thunderstorm", "lightning"],
      default: ["heatwave", "rain", "earthquake", "thunderstorm", "lightning"],
    },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// One subscription per user per city
subscriptionSchema.index({ userId: 1, city: 1 }, { unique: true });

const Subscription = mongoose.model("Subscription", subscriptionSchema);
module.exports = { Subscription };
