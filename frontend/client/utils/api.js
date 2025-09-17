// client/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://mylaundry-backend-hi3w.onrender.com/api" || "http://localhost:3001/api",
  withCredentials: true,
});

export default api;