export interface User {
  id: string;
  name: string;
  cpf: string;
  rg: string;
  endereco_completo: string;
  cep: string;
  telefone: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  isEmailVerified: boolean;
  verificationToken: string | null;
  verificationTokenExpiration: string | null;
  resetToken: string | null;
  resetTokenExpiration: string | null;
  createdAt: string;
  updatedAt: string;
  expoPushToken: string | null;
}
