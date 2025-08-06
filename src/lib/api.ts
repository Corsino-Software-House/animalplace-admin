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

// Interceptor para adicionar token do localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('animalplace_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, success: boolean = false) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(success);
    }
  });
  
  failedQueue = [];
};

// Função para tentar renovar o token
const refreshToken = async (): Promise<boolean> => {
  try {
    const refreshTokenValue = localStorage.getItem('animalplace_refresh_token');
    const userString = localStorage.getItem('animalplace_user');
    
    if (!refreshTokenValue || !userString) {
      throw new Error('Dados de autenticação não encontrados');
    }
    
    const user = JSON.parse(userString);
    
    const response = await axios.post<RefreshTokenResponse>(
      `${env.BASE_URL_API}/api/auth/refresh-token`,
      {
        refreshToken: refreshTokenValue,
        userId: user.id,
      } as RefreshTokenRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
      }
    );

    if (response.data.success) {
      // Salvar novos tokens no localStorage
      localStorage.setItem('animalplace_token', response.data.data.token);
      localStorage.setItem('animalplace_refresh_token', response.data.data.refreshToken);
      return true;
    }
    
    throw new Error('Falha ao renovar token');
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    
    // Limpar dados de autenticação
    localStorage.removeItem('animalplace_user');
    localStorage.removeItem('animalplace_token');
    localStorage.removeItem('animalplace_refresh_token');
    
    return false;
  }
};

// Removido interceptor para credenciais - não mais necessário com localStorage

// Interceptor para lidar com tokens inválidos
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Verificar se é um erro 401 (Unauthorized) em uma requisição autenticada
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Verificar se temos dados de usuário (indicando que estávamos autenticados)
      const userString = localStorage.getItem('animalplace_user');
      
      // Se temos usuário e deu 401, tentar renovar o token
      if (userString) {
        if (isRefreshing) {
          // Se já está tentando renovar, adicionar à fila
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(success => {
            if (success) {
              return api(originalRequest);
            } else {
              return Promise.reject(error);
            }
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const renewalSuccess = await refreshToken();
          
          if (renewalSuccess) {
            // Token renovado com sucesso
            processQueue(null, true);
            return api(originalRequest);
          } else {
            // Falha ao renovar token - fazer logout
            processQueue(error, false);
            redirectToLogin();
            return Promise.reject(error);
          }
        } catch (refreshError) {
          processQueue(refreshError, false);
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
