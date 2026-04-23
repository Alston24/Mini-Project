// Alerts.jsx — Grid of alert cards with filters for type, severity, and city search
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAlerts } from "../hooks/useAlerts";
import { AlertCard } from "../components/AlertCard";
import { ALERT_TYPES, SEVERITY_LEVELS } from "../constants/alertTypes";
import { FiFilter, FiSearch } from "react-icons/fi";

/**
 * Alerts listing page with filtering by type, severity, and city search.
 */
export const Alerts = () => {
  const { alerts, loading } = useAlerts();
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      if (typeFilter !== "all" && alert.alertType !== typeFilter) return false;
      if (severityFilter !== "all" && alert.severity !== severityFilter) return false;
      if (searchQuery && !alert.city.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [alerts, typeFilter, severityFilter, searchQuery]);

  return (
    <div className="alerts-page" id="alerts-page">
      <div className="page-header">
        <h1 className="alerts-title">
          <span className="alerts-title-icon" aria-hidden="true">⚠️</span>
          <span>Active Alerts</span>
        </h1>
        <p>Browse and filter real-time weather alerts from around the world</p>
      </div>

      <div className="filters-bar">
        <div className="filter-group">
          <FiFilter />
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} id="type-filter">
            <option value="all">All Types</option>
            {Object.entries(ALERT_TYPES).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <FiFilter />
          <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)} id="severity-filter">
            <option value="all">All Severities</option>
            {Object.entries(SEVERITY_LEVELS).map(([key, info]) => (
              <option key={key} value={key}>{info.label}</option>
            ))}
          </select>
        </div>

        <div className="filter-group search-filter">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="city-search-filter"
          />
        </div>
      </div>

      <p className="results-count">{filteredAlerts.length} alert(s) found</p>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <div className="alerts-grid">
          {filteredAlerts.length > 0 ? (
            filteredAlerts.map((alert) => (
              <AlertCard
                key={alert._id}
                alert={alert}
                onClick={() => navigate(`/city/${encodeURIComponent(alert.city)}`)}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No alerts match your filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
