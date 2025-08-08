import axios from 'axios';
import { env } from './env';

export const api = axios.create({
  baseURL: env.BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('animalplace_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      
      const hasAuthHeader = originalRequest?.headers?.Authorization;
      
      if (hasAuthHeader) {
        localStorage.removeItem('animalplace_token');
        localStorage.removeItem('animalplace_user');
        
        const currentPath = window.location.pathname;
        const isPublicPage = currentPath === '/login' || 
                           currentPath === '/register' || 
                           currentPath.startsWith('/verify-email');
        
        if (!isPublicPage) {
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
      }
    }
    
    return Promise.reject(error);
  }
);