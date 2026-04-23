// User.js — Mongoose schema for user accounts with saved locations and alert preferences
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const savedLocationSchema = new mongoose.Schema({
  city: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    savedLocations: [savedLocationSchema],
    alertPreferences: {
      type: [String],
      enum: ["heatwave", "rain", "earthquake", "thunderstorm", "lightning"],
      default: ["heatwave", "rain", "earthquake", "thunderstorm", "lightning"],
    },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

/**
 * Hashes password before saving if it was modified.
 */
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compares a candidate password with the stored hash.
 * @param {string} candidatePassword - The password to verify
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
