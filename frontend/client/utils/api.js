import axios from "axios";

// Determine the base URL based on the environment
export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://mylaundry-backend-hi3w.onrender.com/api"
    : "http://localhost:3001/api";

// The backend's root URL (without /api) for serving images
export const BACKEND_URL = API_URL.replace("/api", "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;