import axios from 'axios';

// Centralize API configuration to point to our Spring Boot backend
const api = axios.create({
  // Use Vercel env variable if available, otherwise default to Render (in prod) or localhost
  baseURL: import.meta.env.VITE_API_URL || 'https://vaultxchange-backend.onrender.com/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error caught by interceptor:", error);
    return Promise.reject(error);
  }
);

export default api;
