import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Scheduling } from '@/types/schedule';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface DeleteScheduleDialogProps {
  schedule: Scheduling | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => Promise<boolean>;
  loading: boolean;
}

export function DeleteScheduleDialog({
  schedule,
  open,
  onOpenChange,
  onDelete,
  loading,
}: DeleteScheduleDialogProps) {
  const handleDelete = async () => {
    if (!schedule) return;
    
    const success = await onDelete(schedule.id);
    if (success) {
      onOpenChange(false);
    }
  };

  if (!schedule) return null;

  const scheduledDate = new Date(schedule.data_hora);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>Tem certeza que deseja cancelar este agendamento?</p>
            <div className="bg-gray-50 p-3 rounded-lg space-y-1 text-sm">
              <p><strong>Cliente:</strong> {schedule.user.name}</p>
              <p><strong>Pet:</strong> {schedule.pet.nome}</p>
              <p><strong>Data:</strong> {format(scheduledDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              <p><strong>Serviços:</strong> {schedule.services.map(s => s.name).join(', ')}</p>
            </div>
            <p className="text-red-600 font-medium">Esta ação não pode ser desfeita.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700"
          >
            {loading ? 'Cancelando...' : 'Sim, cancelar agendamento'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}