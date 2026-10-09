
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let accessToken = null;

// Call this after successful login.
export function setAccessToken(token) {
  accessToken =
    typeof token === "string" && token.trim()
      ? token.trim()
      : null;
}

// Optional helper to clear the token during logout.
export function clearAccessToken() {
  accessToken = null;
}

// Attach the current token to every API request.
api.interceptors.request.use(
  (config) => {
    config.headers = config.headers || {};

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      delete config.headers.Authorization;

      console.warn(
        "No access token available for:",
        config.method?.toUpperCase(),
        config.url
      );
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API errors.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error(
        "Authentication failed. Check whether the access token is missing, invalid, or expired.",
        error.response.data
      );
    } else if (!error.response) {
      console.error(
        "Cannot connect to the backend. Check whether the server is running and the API URL is correct.",
        error.message
      );
    }

    return Promise.reject(error);
  }
);

export default api;

