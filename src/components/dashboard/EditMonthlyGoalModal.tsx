import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings } from 'lucide-react';

interface EditMonthlyGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGoal: number;
  onSave: (newGoal: number) => void;
  defaultGoal?: number;
}

export function EditMonthlyGoalModal({
  isOpen,
  onClose,
  currentGoal,
  onSave,
  defaultGoal = 170,
}: EditMonthlyGoalModalProps) {
  const [goal, setGoal] = useState(currentGoal.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    const newGoal = parseInt(goal);
    
    if (isNaN(newGoal) || newGoal <= 0) {
      alert('Por favor, insira um número válido maior que zero.');
      return;
    }

    setIsLoading(true);
    try {
      await onSave(newGoal);
      
      // Criar uma notificação simples
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50';
      notification.textContent = `Meta atualizada para ${newGoal} agendamentos/mês`;
      document.body.appendChild(notification);
      
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 3000);
      
      onClose();
    } catch (error) {
      console.error('Erro ao salvar meta:', error);
      alert('Erro ao salvar a meta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setGoal(currentGoal.toString());
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Editar Meta Mensal
          </DialogTitle>
          <DialogDescription>
            Defina a meta mensal de agendamentos para o dashboard.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="goal" className="text-right">
              Meta
            </Label>
            <Input
              id="goal"
              type="number"
              min="1"
              max="9999"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              className="col-span-3"
              placeholder="Ex: 170"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-2">
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <p className="font-medium text-blue-800 mb-1">💡 Dica:</p>
              <p className="text-blue-700">
                A meta será usada para calcular o progresso no gráfico de agendamentos. 
                Recomendamos definir uma meta realista baseada no histórico dos últimos meses.
              </p>
              <p className="text-blue-600 text-xs mt-2">
                Meta padrão do sistema: {defaultGoal} agendamentos/mês
              </p>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setGoal(defaultGoal.toString())}
            disabled={isLoading}
            className="mr-auto"
          >
            Usar Padrão ({defaultGoal})
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Salvando...' : 'Salvar Meta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
