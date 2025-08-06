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
      <AlertDialogContent className="p-4 sm:p-6 max-w-md sm:max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg sm:text-xl">Cancelar Agendamento</AlertDialogTitle>
          <AlertDialogDescription className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base">Tem certeza que deseja cancelar este agendamento?</p>
            <div className="bg-gray-50 p-3 rounded-lg space-y-2 text-xs sm:text-sm">
              <p><strong>Cliente:</strong> <span className="break-words">{schedule.user.name}</span></p>
              <p><strong>Pet:</strong> {schedule.pet.nome}</p>
              <p><strong>Data:</strong> {format(scheduledDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</p>
              <div className="break-words">
                <strong>Serviços:</strong> {schedule.services.map(s => s.name).join(', ')}
              </div>
            </div>
            <p className="text-red-600 font-medium text-sm sm:text-base">Esta ação não pode ser desfeita.</p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <AlertDialogCancel 
            disabled={loading}
            className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-sm sm:text-base h-9 sm:h-10"
          >
            {loading ? 'Cancelando...' : 'Sim, cancelar agendamento'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}