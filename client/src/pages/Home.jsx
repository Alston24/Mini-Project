// Home.jsx — Landing page with hero, search, live ticker, and featured alert cards
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../hooks/useAlerts";
import { AlertTicker } from "../components/AlertTicker";
import { AlertCard } from "../components/AlertCard";
import { SearchBar } from "../components/SearchBar";
import { ALERT_TYPES } from "../constants/alertTypes";
import { FiMap, FiAlertTriangle, FiShield, FiGlobe } from "react-icons/fi";

/**
 * Home page with hero section, live ticker, featured alerts, and feature cards.
 */
export const Home = () => {
  const navigate = useNavigate();
  const { alerts } = useAlerts();

  const handleSearch = (city) => {
    navigate(`/city/${encodeURIComponent(city)}`);
  };

  // Get one alert per type for featured section
  const featuredAlerts = Object.keys(ALERT_TYPES).reduce((acc, type) => {
    const found = alerts.find((a) => a.alertType === type);
    if (found) acc.push(found);
    return acc;
  }, []);

  return (
    <div className="home-page" id="home-page">
      <AlertTicker />

      <section className="hero-section">
        <div className="hero-bg-effects">
          <div className="hero-orb orb-1" />
          <div className="hero-orb orb-2" />
          <div className="hero-orb orb-3" />
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            Global Weather Alerts<br />
            <span className="hero-highlight">Visualized in Real-Time</span>
          </h1>
          <p className="hero-subtitle">
            Track heatwaves, storms, earthquakes, and more with our interactive heatmap.
            Stay informed, stay safe.
          </p>
          <SearchBar onSearch={handleSearch} placeholder="Search any city for weather alerts..." />
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("/heatmap")}>
              <FiMap /> View Heatmap
            </button>
            <button className="btn-secondary" onClick={() => navigate("/alerts")}>
              <FiAlertTriangle /> Browse Alerts
            </button>
          </div>
        </div>
      </section>

      <section className="stats-section">
        <div className="stat-card">
          <FiAlertTriangle className="stat-icon" />
          <span className="stat-number">{alerts.length}</span>
          <span className="stat-label">Active Alerts</span>
        </div>
        <div className="stat-card">
          <FiGlobe className="stat-icon" />
          <span className="stat-number">20+</span>
          <span className="stat-label">Cities Monitored</span>
        </div>
        <div className="stat-card">
          <FiShield className="stat-icon" />
          <span className="stat-number">24/7</span>
          <span className="stat-label">Real-Time Tracking</span>
        </div>
        <div className="stat-card">
          <FiMap className="stat-icon" />
          <span className="stat-number">5</span>
          <span className="stat-label">Alert Types</span>
        </div>
      </section>

      <section className="featured-section">
        <h2 className="section-title">Featured Alerts</h2>
        <p className="section-subtitle">
          Latest alerts from around the world
        </p>
        <div className="alerts-grid">
          {featuredAlerts.length > 0 ? (
            featuredAlerts.map((alert) => (
              <AlertCard
                key={alert._id}
                alert={alert}
                onClick={() => navigate(`/city/${encodeURIComponent(alert.city)}`)}
              />
            ))
          ) : (
            <div className="empty-state">
              <FiShield size={48} />
              <p>No active alerts — all clear! 🎉</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
