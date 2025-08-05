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
    refreshToken: string;
    user: User;
  };
}

export interface RegisterData {
  name: string;
  email: string;
  cpf: string;
  endereco_completo: string;
  cep: string;
  password: string;
  telefone: string;
  role: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    email: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
  userId: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
  };
}

export interface VerifyEmailCodeData {
  email: string;
  code: string;
}

export interface VerifyEmailCodeResponse {
  message: string;
  user: User;
  token: string;
}

export interface ResendVerificationData {
  email: string;
}

export interface ResendVerificationResponse {
  message: string;
  email: string;
}

export interface LoginData {
  email: string;
  password: string;
}