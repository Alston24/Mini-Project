// api.js — Axios instance with base URL and auth interceptor
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Pre-configured axios instance for all API calls.
 * Automatically attaches JWT token from localStorage.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor — attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("aqify_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 (expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("aqify_token");
      localStorage.removeItem("aqify_user");
    }
    return Promise.reject(error);
  }
);

export { api };
