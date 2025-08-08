import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStats, getAllPets, getMicrochippedPets, MicrochipStats, deleteMicrochippedPet } from '@/services/microchip.service';

export function useMicrochipStats() {
  return useQuery<MicrochipStats>({
    queryKey: ['microchip-stats'],
    queryFn: () => getStats(),
    staleTime: 5 * 60 * 1000,
  });
}

export function usePets() {
  return useQuery({
    queryKey: ['pets'],
    queryFn: () => getAllPets(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMicrochippedPets() {
  return useQuery({
    queryKey: ['microchipped-pets'],
    queryFn: () => getMicrochippedPets(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeleteMicrochippedPet() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteMicrochippedPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['microchipped-pets'] });
      queryClient.invalidateQueries({ queryKey: ['microchip-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
    },
  });
}