import axios from 'axios';
import { env } from './env';
import type { RefreshTokenRequest, RefreshTokenResponse } from '../types/auth';

export const api = axios.create({
  baseURL: env.BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Função para tentar renovar o token
const refreshToken = async (): Promise<string | null> => {
  try {
    const refreshToken = localStorage.getItem('animalplace_refresh_token');
    const userId = localStorage.getItem('animalplace_user_id');
    
    if (!refreshToken || !userId) {
      throw new Error('Refresh token ou user ID não encontrado');
    }

    const response = await axios.post<RefreshTokenResponse>(
      `${env.BASE_URL_API}/auth/refresh`,
      {
        refreshToken,
        userId,
      } as RefreshTokenRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        }
      }
    );

    if (response.data.success && response.data.data) {
      const { token, refreshToken: newRefreshToken } = response.data.data;
      
      // Atualizar tokens no localStorage
      localStorage.setItem('animalplace_token', token);
      localStorage.setItem('animalplace_refresh_token', newRefreshToken);
      
      return token;
    }
    
    throw new Error('Falha ao renovar token');
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    
    // Limpar dados de autenticação
    localStorage.removeItem('animalplace_token');
    localStorage.removeItem('animalplace_refresh_token');
    localStorage.removeItem('animalplace_user');
    localStorage.removeItem('animalplace_user_id');
    
    return null;
  }
};

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
  async (error) => {
    const originalRequest = error.config;
    
    // Verificar se é um erro 401 (Unauthorized) em uma requisição autenticada
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Verificar se a requisição tinha token de autorização
      const hasAuthHeader = originalRequest?.headers?.Authorization;
      
      // Se tinha token e deu 401, tentar renovar o token
      if (hasAuthHeader) {
        if (isRefreshing) {
          // Se já está tentando renovar, adicionar à fila
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshToken();
          
          if (newToken) {
            // Token renovado com sucesso
            processQueue(null, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          } else {
            // Falha ao renovar token - fazer logout
            processQueue(error, null);
            redirectToLogin();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          redirectToLogin();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }
    
    return Promise.reject(error);
  }
);

const redirectToLogin = () => {
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
};
