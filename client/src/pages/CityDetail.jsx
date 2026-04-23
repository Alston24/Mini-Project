// CityDetail.jsx — Detailed weather view for a specific city
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCurrentWeather, getForecast } from "../services/weatherService";
import { useAlerts } from "../hooks/useAlerts";
import { useAuth } from "../hooks/useAuth";
import { subscribeToCity, unsubscribeFromCity } from "../services/userService";
import { WeatherWidget } from "../components/WeatherWidget";
import { AlertCard } from "../components/AlertCard";
import { formatTemp } from "../utils/helpers";
import { FiBell, FiBellOff } from "react-icons/fi";
import toast from "react-hot-toast";

/**
 * City detail page showing current weather, active alerts, and 5-day forecast.
 */
export const CityDetail = () => {
  const { city } = useParams();
  const { alerts } = useAlerts();
  const { user } = useAuth();
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);

  const cityAlerts = alerts.filter(
    (a) => a.city.toLowerCase() === decodeURIComponent(city).toLowerCase()
  );

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const decodedCity = decodeURIComponent(city);
        const [weatherData, forecastData] = await Promise.all([
          getCurrentWeather(decodedCity),
          getForecast(decodedCity),
        ]);
        setWeather(weatherData);
        setForecast(forecastData);
      } catch (err) {
        toast.error("Could not load weather data for this city");
      }
      setLoading(false);
    };
    fetchData();
  }, [city]);

  // Check if user is subscribed
  useEffect(() => {
    if (user?.savedLocations) {
      setSubscribed(
        user.savedLocations.some(
          (loc) => loc.city.toLowerCase() === decodeURIComponent(city).toLowerCase()
        )
      );
    }
  }, [user, city]);

  const handleSubscribe = async () => {
    try {
      await subscribeToCity(decodeURIComponent(city));
      setSubscribed(true);
      toast.success(`Subscribed to ${decodeURIComponent(city)} alerts`);
    } catch {
      toast.error("Failed to subscribe");
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribeFromCity(decodeURIComponent(city));
      setSubscribed(false);
      toast.success(`Unsubscribed from ${decodeURIComponent(city)}`);
    } catch {
      toast.error("Failed to unsubscribe");
    }
  };

  // Get daily forecast (pick one entry per day at noon)
  const dailyForecast = forecast?.list?.filter((item) =>
    item.dt_txt?.includes("12:00:00")
  ).slice(0, 5) || [];

  if (loading) {
    return <div className="loading-container"><div className="spinner" /></div>;
  }

  return (
    <div className="city-detail-page" id="city-detail-page">
      <div className="city-header">
        <h1>📍 {decodeURIComponent(city)}</h1>
        {user && (
          <button
            className={`subscribe-btn ${subscribed ? "subscribed" : ""}`}
            onClick={subscribed ? handleUnsubscribe : handleSubscribe}
          >
            {subscribed ? <><FiBellOff /> Unsubscribe</> : <><FiBell /> Subscribe</>}
          </button>
        )}
      </div>

      <div className="city-content">
        <div className="city-weather-section">
          <h2>Current Weather</h2>
          <WeatherWidget weather={weather} />
        </div>

        <div className="city-alerts-section">
          <h2>Active Alerts ({cityAlerts.length})</h2>
          {cityAlerts.length > 0 ? (
            <div className="city-alerts-list">
              {cityAlerts.map((alert) => (
                <AlertCard key={alert._id} alert={alert} />
              ))}
            </div>
          ) : (
            <p className="no-alerts">No active alerts for this city ✅</p>
          )}
        </div>

        <div className="city-forecast-section">
          <h2>5-Day Forecast</h2>
          <div className="forecast-grid">
            {dailyForecast.map((item, i) => {
              const iconUrl = `https://openweathermap.org/img/wn/${item.weather[0]?.icon}@2x.png`;
              const date = new Date(item.dt_txt);
              return (
                <div key={i} className="forecast-card">
                  <span className="forecast-day">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <img src={iconUrl} alt="" className="forecast-icon" />
                  <span className="forecast-temp">{formatTemp(item.main.temp)}</span>
                  <span className="forecast-desc">{item.weather[0]?.main}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
