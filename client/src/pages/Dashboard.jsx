// Dashboard.jsx — Registered user dashboard with saved locations and preferences
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useAlerts } from "../hooks/useAlerts";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, unsubscribeFromCity } from "../services/userService";
import { AlertCard } from "../components/AlertCard";
import { ALERT_TYPES } from "../constants/alertTypes";
import { FiMapPin, FiTrash2, FiSettings, FiAlertTriangle } from "react-icons/fi";
import toast from "react-hot-toast";

/**
 * User dashboard with saved locations, alert preferences, and recent alerts.
 */
export const Dashboard = () => {
  const { user } = useAuth();
  const { alerts } = useAlerts();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [preferences, setPreferences] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
        setPreferences(data.alertPreferences || []);
      } catch {
        toast.error("Failed to load profile");
      }
    };
    load();
  }, []);

  // Alerts for subscribed cities
  const subscribedAlerts = alerts.filter((alert) =>
    profile?.savedLocations?.some(
      (loc) => loc.city.toLowerCase() === alert.city.toLowerCase()
    )
  );

  /** Toggles an alert type preference. */
  const togglePreference = async (type) => {
    const updated = preferences.includes(type)
      ? preferences.filter((t) => t !== type)
      : [...preferences, type];
    setPreferences(updated);
    try {
      await updateProfile({ alertPreferences: updated });
    } catch {
      toast.error("Failed to update preferences");
    }
  };

  /** Removes a saved location. */
  const removeLocation = async (city) => {
    try {
      await unsubscribeFromCity(city);
      setProfile((prev) => ({
        ...prev,
        savedLocations: prev.savedLocations.filter(
          (loc) => loc.city.toLowerCase() !== city.toLowerCase()
        ),
      }));
      toast.success(`Removed ${city}`);
    } catch {
      toast.error("Failed to remove location");
    }
  };

  return (
    <div className="dashboard-page" id="dashboard-page">
      <div className="page-header">
        <h1>👋 Welcome, {user?.name || "User"}</h1>
        <p>Manage your weather subscriptions and preferences</p>
      </div>

      <div className="dashboard-grid">
        {/* Saved Locations */}
        <div className="dashboard-card">
          <h2><FiMapPin /> Saved Locations</h2>
          <div className="locations-list">
            {profile?.savedLocations?.length > 0 ? (
              profile.savedLocations.map((loc) => (
                <div key={loc.city} className="location-item">
                  <span onClick={() => navigate(`/city/${loc.city}`)}>{loc.city}</span>
                  <button onClick={() => removeLocation(loc.city)} className="remove-btn">
                    <FiTrash2 />
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-text">No saved locations yet. Search for a city to subscribe!</p>
            )}
          </div>
        </div>

        {/* Alert Preferences */}
        <div className="dashboard-card">
          <h2><FiSettings /> Alert Preferences</h2>
          <div className="preferences-grid">
            {Object.entries(ALERT_TYPES).map(([type, info]) => (
              <button
                key={type}
                className={`pref-toggle ${preferences.includes(type) ? "active" : ""}`}
                style={{
                  borderColor: info.color,
                  background: preferences.includes(type) ? info.bgColor : "transparent",
                  color: preferences.includes(type) ? info.color : "#888",
                }}
                onClick={() => togglePreference(type)}
              >
                {info.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Alerts for Subscribed Cities */}
        <div className="dashboard-card full-width">
          <h2><FiAlertTriangle /> Alerts for Your Cities</h2>
          <div className="alerts-grid">
            {subscribedAlerts.length > 0 ? (
              subscribedAlerts.slice(0, 12).map((alert) => (
                <AlertCard key={alert._id} alert={alert}
                  onClick={() => navigate(`/city/${encodeURIComponent(alert.city)}`)} />
              ))
            ) : (
              <p className="empty-text">No alerts for your subscribed cities.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
