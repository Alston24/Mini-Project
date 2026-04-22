// helpers.js — Utility functions used across the frontend

/**
 * Formats a date string into a readable format.
 * @param {string|Date} date - ISO date string or Date object
 * @returns {string} Formatted date (e.g. "Apr 22, 2026 7:30 PM")
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

/**
 * Returns the time elapsed since a given date.
 * @param {string|Date} date - Date to compare against
 * @returns {string} e.g. "2 hours ago", "5 min ago"
 */
export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Returns a temperature with proper unit suffix.
 * @param {number} temp - Temperature in Celsius
 * @returns {string} e.g. "42°C"
 */
export const formatTemp = (temp) => {
  if (temp == null) return "N/A";
  return `${Math.round(temp)}°C`;
};
