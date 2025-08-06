import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface DeletePetDialogProps {
  petName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

export function DeletePetDialog({ 
  petName, 
  isOpen, 
  onOpenChange, 
  onConfirm, 
  isDeleting 
}: DeletePetDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <Trash2 className="mr-2 h-5 w-5" />
            Confirmar Exclusão
          </DialogTitle>
          <DialogDescription>
            Tem certeza que deseja deletar o pet <strong>"{petName}"</strong>?
            <br />
            <span className="text-red-600 font-medium">
              Esta ação não pode ser desfeita e todos os dados do pet serão permanentemente removidos.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deletando...' : 'Deletar Pet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
