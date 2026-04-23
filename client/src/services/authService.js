// authService.js — API calls for authentication (register, login, getMe)
import { api } from "./api";

/**
 * Registers a new user account.
 * @param {{ name: string, email: string, password: string }} userData
 * @returns {Promise<Object>} User data with JWT token
 */
export const registerUser = async (userData) => {
  const { data } = await api.post("/auth/register", userData);
  return data;
};

/**
 * Logs in an existing user.
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<Object>} User data with JWT token
 */
export const loginUser = async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data;
};

/**
 * Fetches the currently authenticated user's profile.
 * @returns {Promise<Object>} User object (without password)
 */
export const getMe = async () => {
  const { data } = await api.get("/auth/me");
  return data;
};
