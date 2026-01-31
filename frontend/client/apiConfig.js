import axios from "axios";

// Determine the base URL based on the environment
// NOTE: I added '/api' to the Render URL because your backend routes are prefixed with /api
export const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://mylaundry-backend-hi3w.onrender.com/api"
    : "http://localhost:3001/api"; 

// If you want to use the Deployed Backend even when running Locally, 
// uncomment the line below and comment out the block above:
// export const API_URL = "https://mylaundry-backend-hi3w.onrender.com/api";

// The backend's root URL (without /api) for serving images
export const BACKEND_URL = API_URL.replace("/api", "");

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export default API_URL;