// WeatherWidget.jsx — Current weather display for a city
import { formatTemp } from "../utils/helpers";
import { FiDroplet, FiWind, FiSun, FiThermometer } from "react-icons/fi";

/**
 * Displays current weather data in a compact widget card.
 * @param {{ weather: Object }} props - OpenWeatherMap current weather data
 */
export const WeatherWidget = ({ weather }) => {
  if (!weather) return null;

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`;

  return (
    <div className="weather-widget" id="weather-widget">
      <div className="weather-main">
        <img src={iconUrl} alt={weather.weather?.[0]?.description} className="weather-icon" />
        <div className="weather-temp-group">
          <span className="weather-temp">{formatTemp(weather.main?.temp)}</span>
          <span className="weather-desc">{weather.weather?.[0]?.description}</span>
        </div>
      </div>

      <div className="weather-details">
        <div className="weather-detail">
          <FiThermometer />
          <span>Feels like {formatTemp(weather.main?.feels_like)}</span>
        </div>
        <div className="weather-detail">
          <FiDroplet />
          <span>Humidity {weather.main?.humidity}%</span>
        </div>
        <div className="weather-detail">
          <FiWind />
          <span>Wind {weather.wind?.speed} m/s</span>
        </div>
        <div className="weather-detail">
          <FiSun />
          <span>UV Index N/A</span>
        </div>
      </div>
    </div>
  );
};
