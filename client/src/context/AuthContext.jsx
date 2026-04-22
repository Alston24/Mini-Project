// AuthContext.jsx — Global auth state management with JWT persistence
import { createContext, useState, useEffect, useCallback } from "react";
import { loginUser, registerUser, getMe } from "../services/authService";

export const AuthContext = createContext(null);

/**
 * Provides auth state (user, token) and actions (login, register, logout).
 * Persists auth in localStorage and restores on mount.
 * @param {{ children: React.ReactNode }} props
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("aqify_token");
      if (token) {
        try {
          const userData = await getMe();
          setUser(userData);
        } catch {
          localStorage.removeItem("aqify_token");
          localStorage.removeItem("aqify_user");
        }
      }
      setLoading(false);
    };
    restoreAuth();
  }, []);

  /**
   * Logs in the user and stores token.
   * @param {{ email: string, password: string }} credentials
   */
  const login = useCallback(async (credentials) => {
    const data = await loginUser(credentials);
    localStorage.setItem("aqify_token", data.token);
    localStorage.setItem("aqify_user", JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  /**
   * Registers a new user and stores token.
   * @param {{ name: string, email: string, password: string }} userData
   */
  const register = useCallback(async (userData) => {
    const data = await registerUser(userData);
    localStorage.setItem("aqify_token", data.token);
    localStorage.setItem("aqify_user", JSON.stringify(data));
    setUser(data);
    return data;
  }, []);

  /** Clears auth state and localStorage. */
  const logout = useCallback(() => {
    localStorage.removeItem("aqify_token");
    localStorage.removeItem("aqify_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
