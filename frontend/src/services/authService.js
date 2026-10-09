
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/register`,
      userData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Registration failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Login an existing user
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      userData
    );

    return response.data;
  } catch (error) {
    console.error(
      "Login failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

