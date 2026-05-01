// Central configuration for the API URL
const VITE_API_URL = import.meta.env.VITE_API_URL;

// We use the environment variable if present, otherwise we fallback to the Render URL or localhost
const API_URL = VITE_API_URL 
  ? `${VITE_API_URL}/api` 
  : (window.location.hostname.includes('onrender.com') 
      ? 'https://royal-timepieces-api.onrender.com/api' 
      : 'http://localhost:5001/api');

console.log('🔗 Connecting to API at:', API_URL);

export default API_URL;
