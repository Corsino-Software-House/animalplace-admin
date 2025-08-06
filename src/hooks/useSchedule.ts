import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { getScheduleService, rescheduleService, deleteScheduleService } from '@/services/schedule';
import { Scheduling } from '@/types/schedule';

export function useSchedule() {
  const [schedules, setSchedules] = useState<Scheduling[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getScheduleService();
      setSchedules(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar agendamentos';
      setError(errorMessage);
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const reschedule = async (id: string, data: { data_hora: string }) => {
    try {
      setLoading(true);
      await rescheduleService(id, data);
      await fetchSchedules();
      toast({
        title: 'Sucesso',
        description: 'Agendamento reagendado com sucesso',
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao reagendar';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      setLoading(true);
      await deleteScheduleService(id);
      setSchedules(schedules.filter(schedule => schedule.id !== id));
      toast({
        title: 'Sucesso',
        description: 'Agendamento cancelado com sucesso',
      });
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar agendamento';
      toast({
        title: 'Erro',
        description: errorMessage,
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  });

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    reschedule,
    deleteSchedule,
  };
}