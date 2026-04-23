// useAuth.js — Custom hook to access AuthContext
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Returns the auth context value (user, login, register, logout, loading).
 * @returns {{ user: Object|null, loading: boolean, login: Function, register: Function, logout: Function }}
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
