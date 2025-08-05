import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Loader2 } from 'lucide-react';
import { registerMicrochip, RegisterMicrochipRequest } from '@/services/microchip.service';
import { usePets } from '@/hooks/useMicrochip';
import { toast } from 'sonner';

interface RegisterMicrochipModalProps {
  trigger?: React.ReactNode;
}

export function RegisterMicrochipModal({ trigger }: RegisterMicrochipModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    petId: '',
    microchip_number: '',
    microchip_manufacturer: '',
    microchip_location: '',
    notes: ''
  });

  const queryClient = useQueryClient();
  const { data: pets = [], isLoading: loadingPets } = usePets();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterMicrochipRequest) => registerMicrochip(data),
    onSuccess: () => {
      toast.success('Microchip registrado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['microchip-stats'] });
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      queryClient.invalidateQueries({ queryKey: ['microchipped-pets'] });
      setOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Erro ao registrar microchip');
    }
  });

  const resetForm = () => {
    setFormData({
      petId: '',
      microchip_number: '',
      microchip_manufacturer: '',
      microchip_location: '',
      notes: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.petId || !formData.microchip_number) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    registerMutation.mutate({
      petId: formData.petId,
      microchipData: {
        microchip_number: formData.microchip_number,
        microchip_manufacturer: formData.microchip_manufacturer,
        microchip_location: formData.microchip_location
      },
      notes: formData.notes
    });
  };

  const defaultTrigger = (
    <Button style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90">
      <Plus className="mr-2 h-4 w-4" />
      Register Microchip
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Microchip</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="petId">Pet *</Label>
            <Select
              value={formData.petId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, petId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um pet" />
              </SelectTrigger>
              <SelectContent>
                {loadingPets ? (
                  <SelectItem value="" disabled>Carregando...</SelectItem>
                ) : (
                  pets.map((pet) => (
                    <SelectItem key={pet.id_pet} value={pet.id_pet}>
                      {pet.nome} ({pet.tipo_animal})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchip_number">Número do Microchip *</Label>
            <Input
              id="microchip_number"
              value={formData.microchip_number}
              onChange={(e) => setFormData(prev => ({ ...prev, microchip_number: e.target.value }))}
              placeholder="Ex: 123456789012345"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchip_manufacturer">Fabricante</Label>
            <Input
              id="microchip_manufacturer"
              value={formData.microchip_manufacturer}
              onChange={(e) => setFormData(prev => ({ ...prev, microchip_manufacturer: e.target.value }))}
              placeholder="Ex: Trovan, AVID, etc."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchip_location">Local de Implantação</Label>
            <Input
              id="microchip_location"
              value={formData.microchip_location}
              onChange={(e) => setFormData(prev => ({ ...prev, microchip_location: e.target.value }))}
              placeholder="Ex: Entre as escápulas"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Observações sobre o procedimento..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={registerMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              style={{ backgroundColor: '#95CA3C' }}
              className="text-white hover:opacity-90"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Registrar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
