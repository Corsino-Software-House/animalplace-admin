import { toast } from "@/hooks/use-toast";
import {
  addServicesToPlan,
  createPlan,
  deletePlan,
  getPlanById,
  getPlanDependencies,
  getPlans,
  removeServicesFromPlan,
  updatePlan,
} from "@/services/plans-service";
import { Plan } from "@/types/plans";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function usePlans() {
  return useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: async () => {
      const response = await getPlans();
      return Array.isArray(response) ? response : [];
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function usePlanById(id: string, enabled: boolean = true) {
  return useQuery<Plan>({
    queryKey: ["plan", id],
    queryFn: async () => {
      const response = await getPlanById(id);
      return response;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (planData: Omit<Plan, "id">) => {
      const response = await createPlan(planData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Plano criado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao criar plano",
        variant: "destructive",
      });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      planData,
    }: {
      id: string;
      planData: Partial<Plan>;
    }) => {
      const response = await updatePlan(id, planData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Plano atualizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao atualizar plano",
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
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir plano",
        variant: "destructive",
      });
    },
  });
}

export function useAddServicesToPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      serviceIds,
    }: {
      planId: string;
      serviceIds: string[];
    }) => {
      const response = await addServicesToPlan(planId, serviceIds);
      return response;
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Sucesso",
        description: `${variables.serviceIds.length} serviço(s) adicionado(s) ao plano!`,
      });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan", variables.planId] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao adicionar serviços ao plano",
        variant: "destructive",
      });
    },
  });
}

export function useRemoveServicesFromPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      planId,
      serviceIds,
    }: {
      planId: string;
      serviceIds: string[];
    }) => {
      const response = await removeServicesFromPlan(planId, serviceIds);
      return response;
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Sucesso",
        description: `${variables.serviceIds.length} serviço(s) removido(s) do plano!`,
      });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan", variables.planId] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao remover serviços do plano",
        variant: "destructive",
      });
    },
  });
}

export function usePlanDependencies(planId: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["plan-dependencies", planId],
    queryFn: async () => {
      const response = await getPlanDependencies(planId);
      return response;
    },
    enabled: enabled && !!planId,
    staleTime: 5 * 60 * 1000,
  });
}
