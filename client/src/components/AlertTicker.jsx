// AlertTicker.jsx — Scrolling live alert banner at the top of the page
import { useAlerts } from "../hooks/useAlerts";
import { ALERT_TYPES } from "../constants/alertTypes";

/**
 * Displays a continuously scrolling ticker of active alerts.
 * Shows alert type, city, and message in a marquee-style animation.
 */
export const AlertTicker = () => {
  const { alerts } = useAlerts();

  if (!alerts || alerts.length === 0) return null;

  // Duplicate alerts for seamless loop
  const tickerAlerts = [...alerts.slice(0, 15), ...alerts.slice(0, 15)];

  return (
    <div className="alert-ticker" id="alert-ticker">
      <div className="ticker-label">🔴 LIVE</div>
      <div className="ticker-track">
        <div className="ticker-content">
          {tickerAlerts.map((alert, i) => {
            const typeInfo = ALERT_TYPES[alert.alertType] || {};
            return (
              <span key={`${alert._id}-${i}`} className="ticker-item">
                <span
                  className="ticker-dot"
                  style={{ background: typeInfo.color }}
                />
                <strong style={{ color: typeInfo.color }}>
                  {typeInfo.label}
                </strong>
                {" — "}
                {alert.city}: {alert.message}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};
