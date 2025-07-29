import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { API_ENDPOINTS } from '@/lib/api-routes';
import { LoginData, LoginResponse, RegisterData } from '@/types/auth';
import { toast } from 'sonner';

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

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      const response = await api.post(API_ENDPOINTS.LOGIN, data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('animalplace_token', data.data.token);
      localStorage.setItem('animalplace_user', JSON.stringify(data.data.user));
      
      toast.success(data.message);
      
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
    },
    onError: (error: ApiError) => {
      console.error('Erro no login:', error);
      toast.error(error?.response?.data?.message || 'Erro ao fazer login');
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData): Promise<RegisterResponse> => {
      const response = await api.post(API_ENDPOINTS.REGISTER, data);
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

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem('animalplace_token');
    localStorage.removeItem('animalplace_user');
    queryClient.clear();
    window.location.href = '/login';
  };
};

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
