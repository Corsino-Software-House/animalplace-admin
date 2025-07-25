import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiLogin, apiRegister, API_ENDPOINTS, LoginData, LoginResponse, RegisterData } from '../lib/api';
import { toast } from 'sonner';

// Tipos para as respostas de erro
interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

// Hook para login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      const response = await apiLogin.post(API_ENDPOINTS.LOGIN, data);
      return response.data;
    },
    onSuccess: (data) => {
      // Salvar token no localStorage
      localStorage.setItem('animalplace_token', data.data.token);
      localStorage.setItem('animalplace_user', JSON.stringify(data.data.user));
      
      toast.success(data.message);
      
      // Invalidar queries relacionadas ao usuário
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      // Redirecionar para dashboard (será implementado no componente)
    },
    onError: (error: ApiError) => {
      console.error('Erro no login:', error);
      toast.error(error?.response?.data?.message || 'Erro ao fazer login');
    },
  });
};

// Hook para registro
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData): Promise<RegisterResponse> => {
      const response = await apiRegister.post(API_ENDPOINTS.REGISTER, data);
      return response.data;
    },
    onSuccess: () => {
      toast.success('Usuário registrado com sucesso!');
    },
    onError: (error: ApiError) => {
      console.error('Erro no registro:', error);
      toast.error(error?.response?.data?.message || 'Erro ao registrar usuário');
    },
  });
};

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('animalplace_token');
    localStorage.removeItem('animalplace_user');
    queryClient.clear();
    window.location.href = '/login';
  };
};

// Hook para verificar se está autenticado
export const useAuth = () => {
  const token = localStorage.getItem('animalplace_token');
  const userString = localStorage.getItem('animalplace_user');
  const user = userString ? JSON.parse(userString) : null;

  return {
    isAuthenticated: !!token,
    user,
    token,
  };
};
