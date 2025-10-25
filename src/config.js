// Configuration for API endpoints
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/.netlify/functions/api'
  : 'http://localhost:5000';

export default API_BASE_URL;
