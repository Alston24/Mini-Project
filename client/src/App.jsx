// App.jsx — Root component with routing and context providers
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import { NavBar } from "./components/NavBar";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Home } from "./pages/Home";
import { Heatmap } from "./pages/Heatmap";
import { Alerts } from "./pages/Alerts";
import { CityDetail } from "./pages/CityDetail";
import { Dashboard } from "./pages/Dashboard";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";

/**
 * Main application component. Wraps everything in auth + alert context providers
 * and sets up client-side routing.
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AlertProvider>
          <div className="app">
            <NavBar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/heatmap" element={<Heatmap />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/city/:city" element={<CityDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute><Dashboard /></ProtectedRoute>
                } />
              </Routes>
            </main>
            <Toaster position="bottom-right" toastOptions={{
              style: { background: "#1a1a2e", color: "#e0e0e0", border: "1px solid #2a2a4a" },
            }} />
          </div>
        </AlertProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
