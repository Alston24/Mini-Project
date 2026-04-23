// Heatmap.jsx — Full-screen interactive heatmap page (USP)
import { useState, useMemo } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useAlerts } from "../hooks/useAlerts";
import { HeatmapLayer } from "../components/HeatmapLayer";
import { AlertMarker } from "../components/AlertMarker";
import { ALERT_TYPES } from "../constants/alertTypes";
import "leaflet/dist/leaflet.css";

/**
 * Full-screen heatmap page with filter sidebar and alert markers.
 * USP of the application — real-time interactive heatmap visualization.
 */
const MapLegend = ({ layer }) => {
  if (layer === "none") return null;

  const legends = {
    temp_new: {
      title: "Temperature (°C)",
      gradient: "linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)",
      steps: ["-40", "-20", "0", "20", "40"],
    },
    precipitation_new: {
      title: "Precipitation (mm)",
      gradient: "linear-gradient(to right, rgba(255,255,255,0), #00d2ff, #3a7bd5, #8e2de2, #ff0080)",
      steps: ["0", "0.5", "2", "10", "50+"],
    },
    clouds_new: {
      title: "Cloud Coverage (%)",
      gradient: "linear-gradient(to right, rgba(255,255,255,0), rgba(255,255,255,0.3), rgba(255,255,255,0.8), #ffffff)",
      steps: ["0", "25", "50", "75", "100"],
    },
    wind_new: {
      title: "Wind Speed (m/s)",
      gradient: "linear-gradient(to right, #00f2fe, #4facfe, #00ff00, #f7ff00, #ff0000)",
      steps: ["0", "5", "10", "20", "40+"],
    },
  };

  const config = legends[layer];
  if (!config) return null;

  return (
    <div className="map-legend-container">
      <div className="legend-label">{config.title}</div>
      <div className="legend-bar-wrapper">
        <div className="legend-bar" style={{ background: config.gradient }} />
        <div className="legend-steps">
          {config.steps.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Heatmap = () => {
  const { heatmapData, alerts, loading } = useAlerts();
  const [activeFilters, setActiveFilters] = useState(
    Object.keys(ALERT_TYPES).reduce((acc, type) => ({ ...acc, [type]: true }), {})
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [weatherLayer, setWeatherLayer] = useState("none"); // none, temp, precipitation, clouds, wind

  const OWM_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

  /** Toggles a specific alert type filter. */
  const toggleFilter = (type) => {
    setActiveFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // Filter data based on active filters
  const filteredData = useMemo(
    () => heatmapData.filter((a) => activeFilters[a.alertType]),
    [heatmapData, activeFilters]
  );

  const filteredAlerts = useMemo(
    () => alerts.filter((a) => activeFilters[a.alertType]),
    [alerts, activeFilters]
  );

  const weatherLayers = [
    { id: "none", label: "Standard Map", icon: "🌍" },
    { id: "temp_new", label: "Temperature", icon: "🌡️" },
    { id: "precipitation_new", label: "Rain / Snow", icon: "🌧️" },
    { id: "clouds_new", label: "Clouds", icon: "☁️" },
    { id: "wind_new", label: "Wind Speed", icon: "💨" },
  ];

  return (
    <div className="heatmap-page" id="heatmap-page">
      {/* Filter Sidebar */}
      <div className={`heatmap-sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <h3>🗺️ Map Controls</h3>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="sidebar-toggle">
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        {sidebarOpen && (
          <div className="sidebar-content-scroll">
            <div className="sidebar-section">
              <h4>🌦️ Weather Layers</h4>
              <div className="layer-buttons">
                {weatherLayers.map((layer) => (
                  <button
                    key={layer.id}
                    className={`layer-select-btn ${weatherLayer === layer.id ? "active" : ""}`}
                    onClick={() => setWeatherLayer(layer.id)}
                  >
                    <span>{layer.icon}</span>
                    {layer.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h4>⚠️ Alert Filters</h4>
              <div className="filter-buttons">
                {Object.entries(ALERT_TYPES).map(([type, info]) => (
                  <button
                    key={type}
                    className={`filter-btn ${activeFilters[type] ? "active" : ""}`}
                    style={{
                      borderColor: info.color,
                      background: activeFilters[type] ? info.bgColor : "transparent",
                      color: activeFilters[type] ? info.color : "#888",
                    }}
                    onClick={() => toggleFilter(type)}
                  >
                    <span className="filter-dot" style={{ background: info.color }} />
                    {info.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h4>📊 Intensity Distribution</h4>
              <div className="severity-chart">
                {["low", "medium", "high", "extreme"].map((sev) => {
                  const count = alerts.filter((a) => a.severity === sev).length;
                  const max = Math.max(...["low", "medium", "high", "extreme"].map(s => alerts.filter(a => a.severity === s).length), 1);
                  const percentage = (count / max) * 100;
                  return (
                    <div key={sev} className="severity-bar-item">
                      <div className="bar-label">
                        <span>{sev}</span>
                        <span>{count}</span>
                      </div>
                      <div className="bar-track">
                        <div 
                          className={`bar-fill sev-${sev}`} 
                          style={{ width: `${percentage}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sidebar-alerts-list">
              <h4>Live Alerts ({filteredAlerts.length})</h4>
              <div className="sidebar-alerts-scroll">
                {filteredAlerts.slice(0, 50).map((alert) => {
                  const typeInfo = ALERT_TYPES[alert.alertType] || {};
                  return (
                    <div key={alert._id} className="sidebar-alert-item">
                      <span className="sidebar-dot" style={{ background: typeInfo.color }} />
                      <div>
                        <strong>{alert.city}</strong>
                        <span className="sidebar-alert-type">{typeInfo.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map */}
      <div className="heatmap-map-container">
        {loading && (
          <div className="map-loading">
            <div className="spinner" />
            <p>Syncing layers...</p>
          </div>
        )}
        <MapContainer
          center={[20, 0]}
          zoom={3}
          minZoom={2}
          maxZoom={15}
          className="heatmap-map"
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          
          {/* Weather Overlay Layer */}
          {weatherLayer !== "none" && OWM_KEY && (
            <TileLayer
              key={weatherLayer}
              url={`https://tile.openweathermap.org/map/${weatherLayer}/{z}/{x}/{y}.png?appid=${OWM_KEY}`}
              opacity={0.7}
              attribution='&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>'
            />
          )}

          <HeatmapLayer data={filteredData} />
          {filteredData.map((alert) => (
            <AlertMarker key={alert._id} alert={alert} />
          ))}
        </MapContainer>

        {/* Dynamic Legend / Scale Bar */}
        <MapLegend layer={weatherLayer} />
      </div>
    </div>
  );
};
