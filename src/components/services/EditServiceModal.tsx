import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Edit } from 'lucide-react';
import { useUpdateService } from '@/hooks/useServices';
import { Service, ServiceType, ServiceCategory, ServiceDto } from '@/types/services';

interface EditServiceModalProps {
  service: Service;
  trigger?: React.ReactNode;
}

export function EditServiceModal({ service, trigger }: EditServiceModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceDto>({
    name: service.name,
    description: service.description,
    price: service.price,
    duration: service.duration,
    type: service.type,
    category: service.category,
    isActive: service.isActive,
    defaultLimits: service.defaultLimits || {
      limit: 1,
      period: 'month' as const,
      carencyDays: 0,
    },
  });

  const updateMutation = useUpdateService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || formData.price <= 0 || formData.duration <= 0) {
      return;
    }

    updateMutation.mutate({ id: service.id, serviceData: formData }, {
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
      <DialogContent className="sm:max-w-[600px] max-h-[95vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Editar Serviço - {service.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nome do serviço"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
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
              placeholder="Descrição do serviço"
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos) *</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 0 }))}
                placeholder="30"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ServiceType) => setFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ServiceType.CONSULTATION}>Consulta</SelectItem>
                  <SelectItem value={ServiceType.VACCINE}>Vacina</SelectItem>
                  <SelectItem value={ServiceType.EXAM}>Exame</SelectItem>
                  <SelectItem value={ServiceType.PROCEDURE}>Procedimento</SelectItem>
                  <SelectItem value={ServiceType.SURGERY}>Cirurgia</SelectItem>
                  <SelectItem value={ServiceType.AESTHETIC}>Estético</SelectItem>
                  <SelectItem value={ServiceType.HOSPITALIZATION}>Internação</SelectItem>
                  <SelectItem value={ServiceType.ANESTHESIA}>Anestesia</SelectItem>
                  <SelectItem value={ServiceType.BATH_AND_GROOMING}>Banho e Tosa</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={formData.category}
              onValueChange={(value: ServiceCategory) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ServiceCategory.CLINICAL}>Clínico</SelectItem>
                <SelectItem value={ServiceCategory.AESTHETIC}>Estético</SelectItem>
                <SelectItem value={ServiceCategory.SURGICAL}>Cirúrgico</SelectItem>
                <SelectItem value={ServiceCategory.DIAGNOSTIC}>Diagnóstico</SelectItem>
                <SelectItem value={ServiceCategory.VACCINE}>Vacina</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Limites Padrão</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="limit">Limite de Uso</Label>
                <Input
                  id="limit"
                  type="number"
                  min="1"
                  value={formData.defaultLimits?.limit || 1}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    defaultLimits: {
                      ...prev.defaultLimits!,
                      limit: parseInt(e.target.value) || 1
                    }
                  }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="period">Período</Label>
                <Select
                  value={formData.defaultLimits?.period || 'month'}
                  onValueChange={(value: 'year' | 'month') => setFormData(prev => ({
                    ...prev,
                    defaultLimits: {
                      ...prev.defaultLimits!,
                      period: value
                    }
                  }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Mês</SelectItem>
                    <SelectItem value="year">Ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="carencyDays">Carência (dias)</Label>
                <Input
                  id="carencyDays"
                  type="number"
                  min="0"
                  value={formData.defaultLimits?.carencyDays || 0}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    defaultLimits: {
                      ...prev.defaultLimits!,
                      carencyDays: parseInt(e.target.value) || 0
                    }
                  }))}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Serviço ativo</Label>
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