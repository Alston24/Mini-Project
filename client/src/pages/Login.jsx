// Login.jsx — User login page with form validation
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import toast from "react-hot-toast";

/**
 * Login page with email/password form and error handling.
 */
export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("All fields are required");
    setLoading(true);
    try {
      await login({ email, password });
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🌦️</span>
          <h1>Welcome Back</h1>
          <p>Sign in to your Aqify account</p>
        </div>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <FiMail className="input-icon" />
            <input type="email" placeholder="Email address" value={email}
              onChange={(e) => setEmail(e.target.value)} id="login-email" />
          </div>
          <div className="input-group">
            <FiLock className="input-icon" />
            <input type="password" placeholder="Password" value={password}
              onChange={(e) => setPassword(e.target.value)} id="login-password" />
          </div>
          <button type="submit" className="btn-primary full-width" disabled={loading}>
            <FiLogIn /> {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};
