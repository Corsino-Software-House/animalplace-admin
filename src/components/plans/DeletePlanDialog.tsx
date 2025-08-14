import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useDeletePlan } from '@/hooks/usePlans';
import { Plan } from '@/types/plans';

interface DeletePlanDialogProps {
  plan: Plan;
  trigger?: React.ReactNode;
}

export function DeletePlanDialog({ plan, trigger }: DeletePlanDialogProps) {
  const [open, setOpen] = useState(false);
  const deleteMutation = useDeletePlan();

  const handleDelete = () => {
    if (!plan.id) return;
    
    deleteMutation.mutate(plan.id, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
      <Trash2 className="h-4 w-4" />
    </Button>
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o plano "{plan.name || 'Sem Nome'}"? 
            Esta ação não pode ser desfeita e pode afetar usuários que possuem este plano.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}