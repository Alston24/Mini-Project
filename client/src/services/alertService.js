// alertService.js — API calls for alert data (list, heatmap, CRUD)
import { api } from "./api";

/**
 * Fetches all active alerts with optional filters.
 * @param {Object} filters - { type, severity, country, city }
 * @returns {Promise<Array>} Array of alert objects
 */
export const getAllAlerts = async (filters = {}) => {
  const { data } = await api.get("/alerts", { params: filters });
  return data;
};

/**
 * Fetches alert data formatted for heatmap visualization.
 * @returns {Promise<Array>} Array of { lat, lon, severity, alertType, city, message }
 */
export const getHeatmapData = async () => {
  const { data } = await api.get("/alerts/heatmap");
  return data;
};

/**
 * Fetches a single alert by its ID.
 * @param {string} id - Alert MongoDB ID
 * @returns {Promise<Object>} Alert object
 */
export const getAlertById = async (id) => {
  const { data } = await api.get(`/alerts/${id}`);
  return data;
};
