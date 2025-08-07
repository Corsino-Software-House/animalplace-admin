import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface PaymentDiagnosisResult {
  diagnosis: string[];
  fixes: string[];
  paymentsFound: number;
  subscriptionsFound: number;
  issuesFixed: number;
}

interface PaymentStats {
  totalRevenue: number;
  completedCount: number;
  pendingCount: number;
  failedCount: number;
  revenueGrowth: string;
}

export const usePaymentDiagnosis = () => {
  return useMutation({
    mutationFn: async (): Promise<PaymentDiagnosisResult> => {
      const response = await api.post('/api/payments/diagnose-and-fix');
      return response.data;
    },
    onSuccess: (data) => {
      if (data.issuesFixed > 0) {
        toast.success(`✅ Diagnóstico concluído! ${data.issuesFixed} problemas corrigidos.`);
      } else {
        toast.success('✅ Diagnóstico concluído! Nenhum problema encontrado.');
      }
    },
    onError: (error: unknown) => {
      console.error('Erro no diagnóstico:', error);
      toast.error('Erro ao executar diagnóstico de pagamentos');
    },
  });
};

export const usePaymentStats = () => {
  return useMutation({
    mutationFn: async (): Promise<PaymentStats> => {
      const response = await api.get('/api/payments/stats');
      return response.data;
    },
    onError: (error: unknown) => {
      console.error('Erro ao buscar estatísticas:', error);
      toast.error('Erro ao buscar estatísticas de pagamentos');
    },
  });
};
