import axios from 'axios';
import { env } from './env';

export const api = axios.create({
  baseURL: env.BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('animalplace_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para lidar com tokens inválidos
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Verificar se é um erro 401 (Unauthorized) em uma requisição autenticada
    if (error.response?.status === 401) {
      const originalRequest = error.config;
      
      // Verificar se a requisição tinha token de autorização
      const hasAuthHeader = originalRequest?.headers?.Authorization;
      
      // Se tinha token e deu 401, significa que o token é inválido
      if (hasAuthHeader) {
        // Limpar dados de autenticação
        localStorage.removeItem('animalplace_token');
        localStorage.removeItem('animalplace_user');
        
        // Evitar redirect em loop - só redirecionar se não estivermos já em páginas públicas
        const currentPath = window.location.pathname;
        const isPublicPage = currentPath === '/login' || 
                           currentPath === '/register' || 
                           currentPath.startsWith('/verify-email');
        
        if (!isPublicPage) {
          // Pequeno delay para garantir que o localStorage foi limpo
          setTimeout(() => {
            window.location.href = '/login';
          }, 100);
        }
      }
    }
    
    return Promise.reject(error);
  }
);
