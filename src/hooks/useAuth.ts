import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
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

// Interface para o check de autenticação
interface AuthCheckResponse {
  success: boolean;
  authenticated: boolean;
  message: string;
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      const response = await api.post(LOGIN_ROUTE(), data);
      return response.data;
    },
    onSuccess: (data) => {
      // Salva apenas o usuário para exibição
      localStorage.setItem('animalplace_user', JSON.stringify(data.data.user));
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['auth-check'] });
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
    // Fazer logout no backend para limpar cookies
    api.post('/auth/logout').catch(() => {
      // Se falhar, não há problema, só limpar dados localmente
    });
    window.location.href = '/login';
  };
};

// Função para limpar dados de autenticação
export const clearAuth = () => {
  localStorage.removeItem('animalplace_user');
  // Nota: os tokens ficam em cookies HTTP-Only e são limpos pelo backend
};

// Hook para verificar autenticação baseado em cookies
export const useAuthCheck = () => {
  return useQuery({
    queryKey: ['auth-check'],
    queryFn: async (): Promise<AuthCheckResponse> => {
      try {
        const response = await api.get('api/auth/check');
        return response.data;
      } catch (error) {
        return {
          success: false,
          authenticated: false,
          message: 'Não autenticado',
        };
      }
    },
    retry: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Função para verificar se o token está válido (formato básico)
export const useAuth = () => {
  const userString = localStorage.getItem('animalplace_user');
  const user = userString ? JSON.parse(userString) : null;
  const { data: authCheck, isLoading } = useAuthCheck();

  // Se estiver carregando, considera autenticado temporariamente para evitar flicker
  if (isLoading && user) {
    return {
      isAuthenticated: true,
      user,
      isLoading: true,
    };
  }

  // Verifica se tem usuário e se a verificação de autenticação é válida
  const isAuthenticated = !!(user && authCheck?.authenticated);

  // Se o usuário estava "logado" mas o check falhou, limpar dados
  if (user && authCheck?.authenticated === false) {
    clearAuth();
  }

  return {
    isAuthenticated,
    user: isAuthenticated ? user : null,
    isLoading: false,
  };
};
