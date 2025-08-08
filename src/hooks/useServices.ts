import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices, createService, updateService, deleteService, getServiceById } from '@/services/services-crud';
import { Service, ServiceDto } from '@/types/services';
import { toast } from '@/hooks/use-toast';

export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await getServices();
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (serviceData: ServiceDto) => {
      const response = await createService(serviceData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Serviço criado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: 'Erro ao criar serviço',
        variant: "destructive",
      });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, serviceData }: { id: string; serviceData: ServiceDto }) => {
      const response = await updateService(id, serviceData);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Serviço atualizado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: 'Erro ao atualizar serviço',
        variant: "destructive",
      });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteService(id);
      return response.data;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Serviço excluído com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: 'Erro ao excluir serviço',
        variant: "destructive",
      });
    },
  });
}

export function useServiceById(id: string, enabled: boolean = true) {
  return useQuery<Service>({
    queryKey: ['service', id],
    queryFn: async () => {
      const response = await getServiceById(id);
      return response.data;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000,
  });
}