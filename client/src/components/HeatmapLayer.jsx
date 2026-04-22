// HeatmapLayer.jsx — Leaflet map with heatmap overlay using leaflet.heat
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import { severityToIntensity } from "../constants/alertTypes";

/**
 * Adds a heatmap layer to the parent Leaflet map using alert data.
 * Updates whenever the data array changes.
 * @param {{ data: Array<{ lat: number, lon: number, severity: string }> }} props
 */
export const HeatmapLayer = ({ data }) => {
  const map = useMap();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const points = data.map((alert) => [
      alert.lat,
      alert.lon,
      severityToIntensity(alert.severity),
    ]);

    const heatLayer = L.heatLayer(points, {
      radius: 35,
      blur: 25,
      maxZoom: 10,
      gradient: {
        0.2: "#4CAF50",
        0.4: "#FF9800",
        0.7: "#F44336",
        1.0: "#9C27B0",
      },
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [data, map]);

  return null;
};
