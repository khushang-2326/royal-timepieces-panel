// Central configuration for the API URL
const VITE_API_URL = import.meta.env.VITE_API_URL;

let API_URL = 'http://localhost:5001/api';

if (VITE_API_URL) {
  // Ensure the URL is complete
  if (VITE_API_URL.startsWith('http')) {
    API_URL = `${VITE_API_URL}/api`;
  } else {
    API_URL = `https://${VITE_API_URL}.onrender.com/api`;
  }
} else if (window.location.hostname.includes('onrender.com')) {
  // Fallback for Render
  API_URL = 'https://royal-timepieces-api.onrender.com/api';
}

console.log('🔗 Connecting to API at:', API_URL);

export default API_URL;
