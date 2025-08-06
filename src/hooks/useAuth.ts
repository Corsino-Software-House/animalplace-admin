import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { LOGIN_ROUTE, REGISTER_ROUTE, VERIFY_EMAIL_CODE_ROUTE, RESEND_VERIFICATION_ROUTE } from '@/lib/api-routes';
import { 
  LoginData, 
  LoginResponse, 
  RegisterData, 
  RegisterResponse,
  VerifyEmailCodeData,
  VerifyEmailCodeResponse,
  ResendVerificationData,
  ResendVerificationResponse
} from '@/types/auth';
import { toast } from 'sonner';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      const response = await api.post(LOGIN_ROUTE(), data);
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
      
      if (error?.response?.data && 'error' in (error.response.data as { error: string })) {
        const errorData = error.response.data as { error: string; user?: { email: string } };
        if (errorData.error === 'EMAIL_NOT_VERIFIED') {
          toast.error('Email não verificado. Redirecionando para verificação...');
          if (errorData.user?.email) {
            window.location.href = `/verify-email?email=${encodeURIComponent(errorData.user.email)}`;
          }
          return;
        }
      }
      
      toast.error(error?.response?.data?.message || 'Erro ao fazer login');
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData): Promise<RegisterResponse> => {
      const response = await api.post(REGISTER_ROUTE(), data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: ApiError) => {
      console.error('Erro no registro:', error);
      toast.error(error?.response?.data?.message || 'Erro ao registrar usuário');
    },
  });
};

export const useVerifyEmailCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VerifyEmailCodeData): Promise<VerifyEmailCodeResponse> => {
      const response = await api.post(VERIFY_EMAIL_CODE_ROUTE(), data);
      return response.data;
    },
    onSuccess: (data) => {
      localStorage.setItem('animalplace_token', data.token || '');
      localStorage.setItem('animalplace_user', JSON.stringify(data.user));
      
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error: ApiError) => {
      console.error('Erro na verificação:', error);
      toast.error(error?.response?.data?.message || 'Erro ao verificar código');
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: async (data: ResendVerificationData): Promise<ResendVerificationResponse> => {
      const response = await api.post(RESEND_VERIFICATION_ROUTE(), data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: (error: ApiError) => {
      console.error('Erro ao reenviar código:', error);
      toast.error(error?.response?.data?.message || 'Erro ao reenviar código de verificação');
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return () => {
    clearAuth();
    queryClient.clear();
    window.location.href = '/login';
  };
};

// Função para limpar dados de autenticação
export const clearAuth = () => {
  localStorage.removeItem('animalplace_token');
  localStorage.removeItem('animalplace_user');
};

// Função para verificar se o token está válido (formato básico)
const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    // Verificar se o token tem o formato JWT básico (3 partes separadas por ponto)
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    // Decodificar o payload para verificar expiração
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    // Se tem campo de expiração, verificar se não expirou
    if (payload.exp && payload.exp < now) {
      clearAuth();
      return false;
    }
    
    return true;
  } catch {
    // Se não conseguir decodificar, considerar inválido
    clearAuth();
    return false;
  }
};

export const useAuth = () => {
  const token = localStorage.getItem('animalplace_token');
  const userString = localStorage.getItem('animalplace_user');
  const user = userString ? JSON.parse(userString) : null;

  // Verificar se o token é válido
  const isValidToken = isTokenValid(token);
  
  // Se o token não for válido, limpar dados
  if (token && !isValidToken) {
    clearAuth();
  }

  return {
    isAuthenticated: !!token && isValidToken,
    user: isValidToken ? user : null,
    token: isValidToken ? token : null,
  };
};