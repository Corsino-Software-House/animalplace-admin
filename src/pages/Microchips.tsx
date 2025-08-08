import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Edit, Zap, Trash2 } from 'lucide-react';
import { useMicrochipStats, useMicrochippedPets, useDeleteMicrochippedPet } from '@/hooks/useMicrochip';
import { RegisterMicrochipModal } from '@/components/microchip/RegisterMicrochipModal';
import { EditPetModal } from '@/components/microchip/EditPetModal';
import { DeletePetDialog } from '@/components/microchip/DeletePetDialog';
import { MicrochippedPet } from '@/services/microchip.service';
import { MicrochipStatsSkeleton, MicrochipTableSkeleton } from '@/components/microchip/MicrochipSkeleton';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function Microchips() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; petId: string; petName: string }>({
    isOpen: false,
    petId: '',
    petName: ''
  });
  
  const { data: stats, isLoading: loadingStats } = useMicrochipStats();
  const { data: microchippedPets = [], isLoading: loadingPets } = useMicrochippedPets();
  const deleteMutation = useDeleteMicrochippedPet();
  
  const filteredPets = microchippedPets.filter((pet: MicrochippedPet) =>
    pet.microchip_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pet.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeletePet = async (petId: string, petName: string) => {
    setDeleteDialog({ isOpen: true, petId, petName });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteMutation.mutateAsync(deleteDialog.petId);
      setDeleteDialog({ isOpen: false, petId: '', petName: '' });
    } catch (error) {
      console.error('Erro ao deletar pet:', error);
      alert('Erro ao deletar pet. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Microchips</h1>
          <p className="text-gray-600 mt-2">Acompanhe e gerencie registros de microchips de pets</p>
        </div>
        <RegisterMicrochipModal />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Zap className="h-4 w-4" style={{ color: '#95CA3C' }} />
                <div>
                  <div className="text-2xl font-bold">
                    {stats?.totalPets || 0}
                  </div>
                  <p className="text-sm text-gray-600">Total de Pets</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">
                {stats?.microchippedPets || 0}
              </div>
              <p className="text-sm text-gray-600">Pets Microchipados</p>
            </CardContent>
          </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <Card>
          <CardContent className="pt-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por número do chip, nome do pet ou proprietário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Pets Microchipados ({filteredPets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número do Chip</TableHead>
                  <TableHead>Pet</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Raça</TableHead>
                  <TableHead>Pelagem</TableHead>
                  <TableHead>Proprietário</TableHead>
                  <TableHead>Data de Implantação</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      Nenhum pet microchipado encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPets.map((pet: MicrochippedPet) => (
                    <TableRow key={pet.id_pet}>
                      <TableCell className="font-mono text-sm">
                        {pet.microchip_number}
                      </TableCell>
                      <TableCell className="font-medium">{pet.nome}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{pet.tipo}</Badge>
                      </TableCell>
                      <TableCell>{pet.raca || 'N/A'}</TableCell>
                      <TableCell>{pet.pelagem || 'N/A'}</TableCell>
                      <TableCell>{pet.ownerName || 'N/A'}</TableCell>
                      <TableCell className="text-gray-600">
                        {pet.microchip_implantation_date
                          ? format(new Date(pet.microchip_implantation_date), 'dd/MM/yyyy', { locale: ptBR })
                          : 'Não informado'
                        }
                      </TableCell>
                      <TableCell>
                        {pet.microchip_location || 'Não informado'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <EditPetModal 
                              pet={pet}
                              trigger={
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </DropdownMenuItem>
                              }
                            />
                            <DropdownMenuItem 
                              className="text-red-600 focus:text-red-600"
                              onClick={() => handleDeletePet(pet.id_pet, pet.nome)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              {deleteMutation.isPending ? 'Deletando...' : 'Deletar'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <DeletePetDialog
        petName={deleteDialog.petName}
        isOpen={deleteDialog.isOpen}
        onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, isOpen: open }))}
        onConfirm={handleConfirmDelete}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}