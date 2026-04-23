// NavBar.jsx — Responsive navigation bar with auth state awareness
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiMenu, FiX, FiMapPin, FiAlertTriangle, FiMap, FiUser, FiLogOut } from "react-icons/fi";

/**
 * Main navigation bar. Shows login/register links or user menu based on auth state.
 */
export const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
          <span className="brand-icon">🌦️</span>
          <span className="brand-text">Aqify</span>
        </Link>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
            <FiMapPin /> Home
          </Link>
          <Link to="/heatmap" className="nav-link" onClick={() => setMenuOpen(false)}>
            <FiMap /> Heatmap
          </Link>
          <Link to="/alerts" className="nav-link" onClick={() => setMenuOpen(false)}>
            <FiAlertTriangle /> Alerts
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="nav-link" onClick={() => setMenuOpen(false)}>
                <FiUser /> Dashboard
              </Link>
              <button className="nav-btn logout-btn" onClick={handleLogout}>
                <FiLogOut /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-btn login-btn" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/register" className="nav-btn register-btn" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
