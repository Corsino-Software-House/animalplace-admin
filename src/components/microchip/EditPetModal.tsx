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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Edit, Loader2 } from 'lucide-react';
import { updatePet, UpdatePetRequest, MicrochippedPet } from '@/services/microchip.service';
import { toast } from 'sonner';

interface EditPetModalProps {
  pet: MicrochippedPet;
  trigger?: React.ReactNode;
}

export function EditPetModal({ pet, trigger }: EditPetModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nome: pet.nome,
    tipo: pet.tipo,
    raca: pet.raca,
    pelagem: pet.pelagem,
    microchip_number: pet.microchip_number,
    microchip_location: pet.microchip_location,
    microchip_implantation_date: pet.microchip_implantation_date || ''
  });

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePetRequest) => updatePet(pet.id_pet, data),
    onSuccess: () => {
      toast.success('Pet atualizado com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['microchipped-pets'] });
      queryClient.invalidateQueries({ queryKey: ['microchip-stats'] });
      setOpen(false);
    },
    onError: (error: unknown) => {
      toast.error((error as Error).message || 'Erro ao atualizar pet');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nome || !formData.tipo || !formData.microchip_number) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    updateMutation.mutate({
      nome: formData.nome,
      tipo_animal: formData.tipo,
      raca: formData.raca,
      pelagem: formData.pelagem,
      microchip_number: formData.microchip_number,
      microchip_location: formData.microchip_location,
      microchip_implantation_date: formData.microchip_implantation_date
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Pet - {pet.nome}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome do pet"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo *</Label>
            <Select
              value={formData.tipo}
              onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cachorro">Cachorro</SelectItem>
                <SelectItem value="Gato">Gato</SelectItem>
                <SelectItem value="Coelho">Coelho</SelectItem>
                <SelectItem value="Pássaro">Pássaro</SelectItem>
                <SelectItem value="Outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="raca">Raça</Label>
            <Input
              id="raca"
              value={formData.raca}
              onChange={(e) => setFormData(prev => ({ ...prev, raca: e.target.value }))}
              placeholder="Raça do pet"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pelagem">Pelagem</Label>
            <Input
              id="pelagem"
              value={formData.pelagem}
              onChange={(e) => setFormData(prev => ({ ...prev, pelagem: e.target.value }))}
              placeholder="Cor/tipo da pelagem"
            />
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
            <Label htmlFor="microchip_location">Local de Implantação</Label>
            <Input
              id="microchip_location"
              value={formData.microchip_location}
              onChange={(e) => setFormData(prev => ({ ...prev, microchip_location: e.target.value }))}
              placeholder="Ex: Entre as escápulas"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="microchip_implantation_date">Data de Implantação</Label>
            <Input
              id="microchip_implantation_date"
              type="date"
              value={formData.microchip_implantation_date}
              onChange={(e) => setFormData(prev => ({ ...prev, microchip_implantation_date: e.target.value }))}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={updateMutation.isPending}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              style={{ backgroundColor: '#95CA3C' }}
              className="text-white hover:opacity-90"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Atualizar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
