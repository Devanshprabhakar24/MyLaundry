import axios from "axios";

// --- FIXED: Hardcoded to your Render Backend ---
// We removed the 'process.env' check so it works on your local machine too.
import { API_URL } from "../apiConfig";

// The backend's root URL (without /api) for serving images
export const BACKEND_URL = API_URL.replace("/api", "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('mylaundry_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;