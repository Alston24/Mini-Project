// userService.js — API calls for user profile and subscriptions
import { api } from "./api";

/**
 * Fetches the current user's profile.
 * @returns {Promise<Object>} User profile
 */
export const getProfile = async () => {
  const { data } = await api.get("/users/profile");
  return data;
};

/**
 * Updates user profile data.
 * @param {Object} updates - { name, alertPreferences, savedLocations }
 * @returns {Promise<Object>} Updated user profile
 */
export const updateProfile = async (updates) => {
  const { data } = await api.put("/users/profile", updates);
  return data;
};

/**
 * Subscribes to weather alerts for a city.
 * @param {string} city - City name
 * @param {string[]} alertTypes - Alert types to subscribe to
 * @returns {Promise<Object>} Subscription object
 */
export const subscribeToCity = async (city, alertTypes) => {
  const { data } = await api.post("/users/subscribe", { city, alertTypes });
  return data;
};

/**
 * Unsubscribes from a city's alerts.
 * @param {string} city - City name
 * @returns {Promise<Object>} Confirmation message
 */
export const unsubscribeFromCity = async (city) => {
  const { data } = await api.delete(`/users/subscribe/${city}`);
  return data;
};
