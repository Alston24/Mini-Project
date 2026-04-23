// AlertContext.jsx — Global alert state with auto-refresh
import { createContext, useState, useEffect, useCallback } from "react";
import { getAllAlerts, getHeatmapData } from "../services/alertService";

export const AlertContext = createContext(null);

/**
 * Provides global alert data and heatmap data with auto-refresh every 60s.
 * @param {{ children: React.ReactNode }} props
 */
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  /** Fetches all active alerts from the API. */
  const fetchAlerts = useCallback(async () => {
    try {
      const data = await getAllAlerts();
      setAlerts(data);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    }
  }, []);

  /** Fetches heatmap-formatted alert data. */
  const fetchHeatmap = useCallback(async () => {
    try {
      const data = await getHeatmapData();
      setHeatmapData(data);
    } catch (error) {
      console.error("Failed to fetch heatmap data:", error);
    }
  }, []);

  /** Refreshes both alerts and heatmap data. */
  const refresh = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchAlerts(), fetchHeatmap()]);
    setLoading(false);
  }, [fetchAlerts, fetchHeatmap]);

  // Initial load + auto-refresh every 60 seconds
  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 60000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <AlertContext.Provider value={{ alerts, heatmapData, loading, refresh }}>
      {children}
    </AlertContext.Provider>
  );
};
