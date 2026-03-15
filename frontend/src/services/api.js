import axios from 'axios';

// Centralize API configuration to point to our Spring Boot backend
const api = axios.create({
  baseURL: 'http://localhost:8082/api',
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
