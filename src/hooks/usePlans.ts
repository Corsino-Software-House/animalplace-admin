import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPlans, getPlanById, createPlan, updatePlan, deletePlan } from '@/services/plans-service';
import { Plan } from '@/types/plans';
import { toast } from '@/hooks/use-toast';

export function usePlans() {
  return useQuery<Plan[]>({
    queryKey: ['plans'],
    queryFn: async () => {
      const response = await getPlans();
      return Array.isArray(response) ? response : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function usePlanById(id: string, enabled: boolean = true) {
  return useQuery<Plan>({
    queryKey: ['plan', id],
    queryFn: async () => {
      const response = await getPlanById(id);
      return response;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: Omit<Plan, 'id'>) => {
      const response = await createPlan(planData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Plano criado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error?.response?.data?.message || 'Erro ao criar plano',
        variant: "destructive",
      });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, planData }: { id: string; planData: Partial<Plan> }) => {
      const response = await updatePlan(id, planData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Plano atualizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error?.response?.data?.message || 'Erro ao atualizar plano',
        variant: "destructive",
      });
    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deletePlan(id);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Plano excluído com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['plans'] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error?.response?.data?.message || 'Erro ao excluir plano',
        variant: "destructive",
      });
    },
  });
}