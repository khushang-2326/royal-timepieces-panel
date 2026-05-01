const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_URL = VITE_API_URL ? `${VITE_API_URL}/api` : 'http://localhost:5001/api';

export default API_URL;
