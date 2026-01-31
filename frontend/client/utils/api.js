import axios from "axios";

// --- FIXED: Hardcoded to your Render Backend ---
// We removed the 'process.env' check so it works on your local machine too.
export const API_URL = "https://mylaundry-backend-hi3w.onrender.com/api";

// The backend's root URL (without /api) for serving images
export const BACKEND_URL = "https://mylaundry-backend-hi3w.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;