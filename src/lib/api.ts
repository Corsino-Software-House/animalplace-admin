import axios from 'axios';
import { env } from './env';
import type { RefreshTokenRequest, RefreshTokenResponse } from '../types/auth';

export const api = axios.create({
  baseURL: env.BASE_URL_API,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true, // Importante para enviar cookies automaticamente
});

// Flag para evitar múltiplas tentativas de refresh simultâneas
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, success: boolean = false) => {
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
    // Como os tokens estão em cookies HTTP-Only, não precisamos buscá-los do localStorage
    // O refresh será feito apenas com os cookies que o navegador envia automaticamente
    const userString = localStorage.getItem('animalplace_user');
    if (!userString) {
      throw new Error('Usuário não encontrado');
    }
    
    const user = JSON.parse(userString);
    
    const response = await axios.post<RefreshTokenResponse>(
      `${env.BASE_URL_API}/auth/refresh-token`,
      {
        refreshToken: '', // Será lido do cookie pelo backend
        userId: user.id,
      } as RefreshTokenRequest,
      {
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        withCredentials: true, // Importante para enviar cookies
      }
    );

    if (response.data.success) {
      // Com cookies HTTP-Only, não precisamos armazenar tokens no localStorage
      // Os novos tokens já foram definidos como cookies pelo backend
      return true;
    }
    
    throw new Error('Falha ao renovar token');
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    
    // Limpar dados de autenticação
    localStorage.removeItem('animalplace_user');
    
    return false;
  }
};

// Interceptor para adicionar credenciais nas requisições
api.interceptors.request.use((config) => {
  // Com cookies HTTP-Only, não precisamos adicionar token manualmente
  // Mas precisamos garantir que os cookies sejam enviados
  config.withCredentials = true;
  return config;
});

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
