import axios from 'axios';

// Create Axios instance
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Rate Limiting and generic errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 429) {
      // Global error handler for 429 Too Many Requests
      console.error('Rate limit aşıldı! Lütfen daha sonra tekrar deneyin.');
      // A toast notification could be fired here, but we keep it simple
      if (typeof window !== 'undefined') {
        alert('Çok fazla istek yapıldı. Lütfen biraz bekleyip tekrar deneyin.');
      }
    }
    return Promise.reject(error);
  }
);

// Interceptor for Auth Token
api.interceptors.request.use((config) => {
  const authStorage = localStorage.getItem('auth-storage');
  if (authStorage) {
    try {
      const { state } = JSON.parse(authStorage);
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`;
      }
    } catch (e) {
      console.error('Failed to parse auth token');
    }
  }
  return config;
});
