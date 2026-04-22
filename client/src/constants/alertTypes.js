// alertTypes.js — Alert type definitions with colors and icons

/**
 * Mapping of alert types to their display properties.
 * Used across all components for consistent styling.
 */
export const ALERT_TYPES = {
  heatwave: {
    label: "Heatwave",
    color: "#E24B4A",
    bgColor: "rgba(226, 75, 74, 0.15)",
    icon: "flame",
  },
  rain: {
    label: "Rain",
    color: "#378ADD",
    bgColor: "rgba(55, 138, 221, 0.15)",
    icon: "cloud-rain",
  },
  earthquake: {
    label: "Earthquake",
    color: "#7F77DD",
    bgColor: "rgba(127, 119, 221, 0.15)",
    icon: "wave",
  },
  thunderstorm: {
    label: "Thunderstorm",
    color: "#EF9F27",
    bgColor: "rgba(239, 159, 39, 0.15)",
    icon: "cloud-lightning",
  },
  lightning: {
    label: "Lightning",
    color: "#FAC775",
    bgColor: "rgba(250, 199, 117, 0.15)",
    icon: "bolt",
  },
};

/**
 * Severity levels with colors for badges.
 */
export const SEVERITY_LEVELS = {
  low: { label: "Low", color: "#4CAF50", bgColor: "rgba(76, 175, 80, 0.15)" },
  medium: { label: "Medium", color: "#FF9800", bgColor: "rgba(255, 152, 0, 0.15)" },
  high: { label: "High", color: "#F44336", bgColor: "rgba(244, 67, 54, 0.15)" },
  extreme: { label: "Extreme", color: "#9C27B0", bgColor: "rgba(156, 39, 176, 0.15)" },
};

/**
 * Converts severity string to heatmap intensity value.
 * @param {string} severity - low|medium|high|extreme
 * @returns {number} Intensity between 0.2 and 1.0
 */
export const severityToIntensity = (severity) => {
  const map = { low: 0.2, medium: 0.4, high: 0.7, extreme: 1.0 };
  return map[severity] || 0.3;
};
