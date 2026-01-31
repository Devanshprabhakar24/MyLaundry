const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_URL = isLocal
    ? "http://localhost:3001/api"
    : "https://mylaundry-backend-hi3w.onrender.com/api";