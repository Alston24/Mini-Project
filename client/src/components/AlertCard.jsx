// AlertCard.jsx — Reusable alert card with severity color badge
import { ALERT_TYPES, SEVERITY_LEVELS } from "../constants/alertTypes";
import { timeAgo, formatTemp } from "../utils/helpers";
import { FiMapPin, FiClock, FiThermometer } from "react-icons/fi";

/**
 * Displays a single alert in card format with severity badge and type icon.
 * @param {{ alert: Object, onClick: Function }} props
 */
export const AlertCard = ({ alert, onClick }) => {
  const typeInfo = ALERT_TYPES[alert.alertType] || {};
  const severityInfo = SEVERITY_LEVELS[alert.severity] || {};

  return (
    <div
      className="alert-card"
      id={`alert-card-${alert._id}`}
      style={{ borderLeft: `4px solid ${typeInfo.color}` }}
      onClick={() => onClick?.(alert)}
    >
      <div className="alert-card-header">
        <span
          className="alert-type-badge"
          style={{ background: typeInfo.bgColor, color: typeInfo.color }}
        >
          {typeInfo.label}
        </span>
        <span
          className="alert-severity-badge"
          style={{ background: severityInfo.bgColor, color: severityInfo.color }}
        >
          {severityInfo.label}
        </span>
      </div>

      <h3 className="alert-card-city">
        <FiMapPin /> {alert.city}
      </h3>

      <p className="alert-card-message">{alert.message}</p>

      <div className="alert-card-footer">
        {alert.temperature != null && (
          <span className="alert-temp">
            <FiThermometer /> {formatTemp(alert.temperature)}
          </span>
        )}
        <span className="alert-time">
          <FiClock /> {timeAgo(alert.createdAt)}
        </span>
      </div>
    </div>
  );
};
