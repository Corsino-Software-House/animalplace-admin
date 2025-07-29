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