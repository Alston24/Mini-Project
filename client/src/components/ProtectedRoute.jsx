// ProtectedRoute.jsx — Redirects unauthenticated users to the login page
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/**
 * Wraps child routes that require authentication.
 * Redirects to /login if no user is logged in.
 * @param {{ children: React.ReactNode }} props
 */
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
