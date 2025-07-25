import axios from 'axios';
import { env } from './env';

// Base URL da API
export const BASE_URL = env.BASE_URL_API;

// Configuração do Axios para login
export const apiLogin = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuração do Axios para registro
export const apiRegister = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuração padrão (usa a URL de login)
export const api = apiLogin;

// Interceptador para adicionar token em requisições autenticadas
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('animalplace_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Tipos para as respostas da API
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  rg: string;
  endereco_completo: string;
  cep: string;
  password: string;
  telefone: string;
  role: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Endpoints da API
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
} as const;
