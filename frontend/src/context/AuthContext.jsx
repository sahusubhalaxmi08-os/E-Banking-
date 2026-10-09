
import { createContext, useContext, useState } from "react";
import {
  registerUser,
  loginUser,
} from "../services/authService.js";
import { setAccessToken } from "../services/api.js";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Save user and authentication token
  const saveAuth = (result) => {
    const receivedToken = result.token || result.accessToken;

    if (!receivedToken) {
      console.error("Authentication response:", result);
      throw new Error(
        "Authentication token is missing from the server response."
      );
    }

    setUser(result.user);
    setToken(receivedToken);
    setAccessToken(receivedToken);
  };

  // Register a new user
  const register = async (userData) => {
    const result = await registerUser(userData);
    saveAuth(result);
    return result;
  };

  // Login an existing user
  const login = async (userData) => {
    const result = await loginUser(userData);
    saveAuth(result);
    return result;
  };

  // Logout the current user
  const logout = () => {
    setUser(null);
    setToken(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, register, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

