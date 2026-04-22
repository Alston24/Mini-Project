# 🌦️ Aqify — Real-Time Weather Alert Heatmap

![Aqify Banner](https://raw.githubusercontent.com/username/repo/main/client/public/favicon.svg) <!-- Replace with actual banner if available -->

**Aqify** is a premium full-stack MERN application designed to provide real-time, interactive visualizations of global weather threats. Using an interactive heatmap, users can track heatwaves, heavy rain, thunderstorms, and even earthquakes across the globe at a glance.

---

## ✨ Key Features

- **🔥 Real-Time Heatmap (USP):** Interactive global map using Leaflet.js and Heatmap layers to visualize the intensity of weather alerts.
- **🛰️ Automated Alert Detection:** Background cron jobs scan global weather data every 10 minutes, automatically categorizing threats by severity (Low to Extreme).
- **🌋 Seismic Tracking:** Integration with the USGS Earthquake API to plot recent seismic activities.
- **🔔 Personalized Subscriptions:** Registered users can "Subscribe" to specific cities and receive tailored alert feeds.
- **📊 Live Alert Ticker:** A continuous, high-performance scrolling banner at the top for instant situational awareness.
- **📱 Responsive & Premium UI:** Dark-themed, glassmorphic design system optimized for all device sizes.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Mapping:** Leaflet & React-Leaflet
- **Visuals:** Leaflet.heat (Heatmap Layer)
- **State Management:** React Context API (Auth & Alerts)
- **Styling:** Custom Vanilla CSS (Design Tokens & Glassmorphism)
- **Icons:** React Icons (Feather Icons)

### Backend
- **Runtime:** Node.js & Express.js
- **Database:** MongoDB with Mongoose ODM
- **Automation:** Node-Cron for scheduled API polling
- **Authentication:** JWT (JSON Web Tokens) with Bcrypt password hashing
- **APIs:** OpenWeatherMap API, USGS Seismic API

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)
- OpenWeatherMap API Key ([Get one here](https://openweathermap.org/api))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/aqify.git
   cd aqify
   ```

2. **Install Dependencies (Root, Server & Client):**
   ```bash
   npm run install-all
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   OPENWEATHER_API_KEY=your_api_key
   CLIENT_URL=http://localhost:5173
   ```

4. **Run the Application:**
   ```bash
   # Start Backend & Frontend simultaneously
   npm run dev
   ```

---

## 📁 Project Structure

```text
aqify/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI (NavBar, AlertCard, Ticker)
│   │   ├── context/        # Global State (Auth, Alerts)
│   │   ├── hooks/          # Custom Logic (useAuth, useAlerts)
│   │   ├── pages/          # View Components (Heatmap, Dashboard)
│   │   ├── services/       # API Abstraction (Axios)
│   │   └── utils/          # Helpers (Date formatting, Temp conversion)
├── server/                 # Express Backend
│   ├── config/             # DB & Env Config
│   ├── controllers/        # Request Handlers
│   ├── middleware/         # Auth & Error Interceptors
│   ├── models/             # Mongoose Schemas (User, Alert)
│   ├── routes/             # API Endpoints
│   └── services/           # Alert Detection & External API Logic
└── README.md
```

---

## 🔌 API Documentation

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Authenticate & return JWT
- `GET /api/auth/me` - Get current session user (Protected)

### Alerts & Weather
- `GET /api/alerts` - List all active global alerts
- `GET /api/alerts/heatmap` - Geo-data for map plotting
- `GET /api/weather/current?city=...` - Live weather proxy
- `GET /api/weather/forecast?city=...` - 5-day forecast proxy

### User Dashboard
- `GET /api/users/profile` - User settings & saved locations
- `POST /api/users/subscribe` - Follow a city for alerts

---

## 🤝 Contributing

1. **Branching:** Always create a feature branch (`feature/your-feature`).
2. **Commit Messages:** Use descriptive messages (e.g., `feat: add earthquake markers`).
3. **Quality:** Ensure `JSDoc` comments are present for new functions.
4. **Environment:** Never commit `.env` files to version control.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Developed with ❤️ by the Aqify Team.
