// AlertMarker.jsx — Custom colored circle marker for each alert type on the map
import { CircleMarker, Popup } from "react-leaflet";
import { ALERT_TYPES, SEVERITY_LEVELS } from "../constants/alertTypes";
import { formatTemp, timeAgo } from "../utils/helpers";

/**
 * Renders a circle marker on the map with a popup showing alert details.
 * Color is determined by alert type.
 * @param {{ alert: Object }} props
 */
export const AlertMarker = ({ alert }) => {
  const typeInfo = ALERT_TYPES[alert.alertType] || {};
  const severityInfo = SEVERITY_LEVELS[alert.severity] || {};

  const radiusMap = { low: 6, medium: 8, high: 10, extreme: 13 };
  const radius = radiusMap[alert.severity] || 7;

  return (
    <CircleMarker
      center={[alert.lat, alert.lon]}
      radius={radius}
      pathOptions={{
        color: typeInfo.color,
        fillColor: typeInfo.color,
        fillOpacity: 0.7,
        weight: 2,
      }}
    >
      <Popup>
        <div className="marker-popup">
          <h4 style={{ color: typeInfo.color, margin: "0 0 4px" }}>
            {typeInfo.label} — {alert.city}
          </h4>
          <p style={{ margin: "2px 0" }}>
            <strong>Severity:</strong>{" "}
            <span style={{ color: severityInfo.color }}>{severityInfo.label}</span>
          </p>
          {alert.temperature != null && (
            <p style={{ margin: "2px 0" }}>
              <strong>Temperature:</strong> {formatTemp(alert.temperature)}
            </p>
          )}
          <p style={{ margin: "2px 0", fontSize: "0.85em", opacity: 0.8 }}>
            {alert.message}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "0.75em", opacity: 0.6 }}>
            {timeAgo(alert.createdAt)}
          </p>
        </div>
      </Popup>
    </CircleMarker>
  );
};
