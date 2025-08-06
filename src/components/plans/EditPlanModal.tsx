import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Edit } from 'lucide-react';
import { useUpdatePlan } from '@/hooks/usePlans';
import { Plan } from '@/types/plans';

interface EditPlanModalProps {
  plan: Plan;
  trigger?: React.ReactNode;
}

export function EditPlanModal({ plan, trigger }: EditPlanModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Plan>>({
    name: plan.name,
    description: plan.description,
    suggestedPrice: plan.suggestedPrice,
    duration: plan.duration,
    isActive: plan.isActive,
    mainColor: plan.mainColor,
  });

  const updateMutation = useUpdatePlan();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.suggestedPrice) {
      return;
    }

    updateMutation.mutate({ id: plan.id!, planData: formData }, {
      onSuccess: () => {
        setOpen(false);
      },
    });
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[600px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Editar Plano - {plan.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Plano *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do plano"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço Sugerido (R$) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.suggestedPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, suggestedPrice: parseFloat(e.target.value) || 0 }))}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição do plano"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (dias)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Cor Principal</Label>
              <Input
                id="color"
                type="color"
                value={formData.mainColor}
                onChange={(e) => setFormData(prev => ({ ...prev, mainColor: e.target.value }))}
                className="h-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Plano ativo</Label>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={updateMutation.isPending}
              style={{ backgroundColor: '#95CA3C' }}
              className="text-white hover:opacity-90 w-full sm:w-auto"
            >
              {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}