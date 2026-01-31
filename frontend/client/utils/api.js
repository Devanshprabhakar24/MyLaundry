import axios from "axios";

// --- FIXED: Force connection to Render Backend ---
// We append '/api' because your backend routes are configured as /api/...
export const API_URL = "https://mylaundry-backend-hi3w.onrender.com/api";

// The backend's root URL (without /api) for serving static images
export const BACKEND_URL = "https://mylaundry-backend-hi3w.onrender.com";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default api;