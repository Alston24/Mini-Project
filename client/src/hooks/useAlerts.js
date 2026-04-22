// useAlerts.js — Custom hook to access AlertContext
import { useContext } from "react";
import { AlertContext } from "../context/AlertContext";

/**
 * Returns the alert context value (alerts, heatmapData, loading, refresh).
 * @returns {{ alerts: Array, heatmapData: Array, loading: boolean, refresh: Function }}
 */
export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
};
