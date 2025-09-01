import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Pet {
  id_pet: string;
  nome: string;
  raca: string;
  tipo_animal: string;
  user: {
    name: string;
    email: string;
  };
  plano?: {
    id: string;
    name: string;
    description: string;
    suggestedPrice: number;
    duration: number;
    mainColor: string;
  } | null;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  type: string;
}

interface ManualServiceRecordModalProps {
  trigger: React.ReactNode;
}

export function ManualServiceRecordModal({ trigger }: ManualServiceRecordModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [petSearchTerm, setPetSearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [notes, setNotes] = useState('');
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isSearchingPets, setIsSearchingPets] = useState(false);
  const [isSearchingServices, setIsSearchingServices] = useState(false);
  const [recordResult, setRecordResult] = useState<any>(null);

  const { toast } = useToast();
  const debouncedPetSearchTerm = useDebounce(petSearchTerm, 500);
  const debouncedServiceSearchTerm = useDebounce(serviceSearchTerm, 500);

  // Pesquisar pets
  const searchPets = async (term: string) => {
    if (!term.trim()) {
      setPets([]);
      return;
    }

    setIsSearchingPets(true);
    try {
      const response = await api.get(`/api/pet/search?q=${encodeURIComponent(term)}`);
      setPets(response.data);
    } catch (error) {
      console.error('Erro ao pesquisar pets:', error);
      toast({
        title: "Erro",
        description: "Não foi possível pesquisar pets. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearchingPets(false);
    }
  };

  // Pesquisar serviços disponíveis para o pet selecionado
  const searchServices = async (term: string) => {
    if (!selectedPet) {
      toast({
        title: "Erro",
        description: "Selecione um pet primeiro para buscar serviços disponíveis.",
        variant: "destructive",
      });
      return;
    }

    if (!term.trim()) {
      setServices([]);
      return;
    }

    setIsSearchingServices(true);
    try {
      // Buscar serviços disponíveis para o pet específico
      const response = await api.get(`/api/services/pet/${selectedPet.id_pet}/available`);
      const availableServices = response.data;
      
      // Filtrar por termo de busca
      const filteredServices = availableServices.filter((service: any) => 
        service.name.toLowerCase().includes(term.toLowerCase()) ||
        service.description.toLowerCase().includes(term.toLowerCase()) ||
        service.type.toLowerCase().includes(term.toLowerCase()) ||
        service.category.toLowerCase().includes(term.toLowerCase())
      );
      
      setServices(filteredServices);
    } catch (error) {
      console.error('Erro ao pesquisar serviços:', error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar serviços disponíveis para este pet. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSearchingServices(false);
    }
  };

  // Efeito para pesquisar pets quando o termo de busca mudar
  useEffect(() => {
    searchPets(debouncedPetSearchTerm);
  }, [debouncedPetSearchTerm]);

  // Efeito para pesquisar serviços quando o termo de busca mudar
  useEffect(() => {
    if (selectedPet) {
      searchServices(debouncedServiceSearchTerm);
    }
  }, [debouncedServiceSearchTerm, selectedPet]);

  // Registrar uso do serviço
  const recordServiceUsage = async () => {
    if (!selectedPet || !selectedService) {
      toast({
        title: "Erro",
        description: "Selecione um pet e um serviço para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsRecording(true);
    try {
      const response = await api.post(
        `/api/services-usage/pet/${selectedPet.id_pet}/service/${selectedService.id}/manual-record`,
        {
          notes: notes.trim() || undefined,
        }
      );

      setRecordResult(response.data);
      toast({
        title: "Sucesso",
        description: "Uso do serviço registrado com sucesso!",
      });

      // Resetar formulário após sucesso
      setTimeout(() => {
        resetForm();
        setIsOpen(false);
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao registrar uso do serviço:', error);
      
      // Tratar erros específicos de forma amigável
      let errorTitle = "Erro";
      let errorDescription = "Erro ao registrar uso do serviço. Tente novamente.";
      
      if (error.response?.data?.message) {
        const message = error.response.data.message.toLowerCase();
        
        // Verificar se é erro de microchip
        if (message.includes('microchip') || message.includes('micro chip')) {
          errorTitle = "Pet não microchipado";
          errorDescription = "Este pet ainda não possui microchip. É necessário microchipar o pet antes de registrar o uso de serviços.";
        }
        // Verificar se é erro de período de carência
        else if (message.includes('carência') || message.includes('carencia') || message.includes('período') || message.includes('periodo') || message.includes('aguardar')) {
          errorTitle = "Período de carência";
          errorDescription = "Este pet ainda está dentro do período de carência da assinatura. Aguarde o período necessário antes de registrar o uso de serviços.";
        }
        // Verificar se é erro de assinatura inativa
        else if (message.includes('assinatura') && (message.includes('inativa') || message.includes('expirada') || message.includes('vencida'))) {
          errorTitle = "Assinatura inativa";
          errorDescription = "Este pet não possui uma assinatura ativa. Renove a assinatura para continuar utilizando os serviços.";
        }
        // Verificar se é erro de serviço não disponível
        else if (message.includes('serviço') && (message.includes('disponível') || message.includes('disponivel'))) {
          errorTitle = "Serviço não disponível";
          errorDescription = "Este serviço não está disponível para este pet ou plano. Verifique as condições da assinatura.";
        }
        // Verificar se é erro de uso esgotado
        else if (message.includes('uso') && (message.includes('esgotado') || message.includes('acabou') || message.includes('limite'))) {
          errorTitle = "Usos esgotados";
          errorDescription = "Este pet já utilizou todos os usos disponíveis para este serviço neste período. Aguarde a renovação da assinatura.";
        }
        // Se não for nenhum dos casos específicos, usar a mensagem original
        else {
          errorDescription = error.response.data.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsRecording(false);
    }
  };

  const resetForm = () => {
    setSelectedPet(null);
    setSelectedService(null);
    setNotes('');
    setPetSearchTerm('');
    setServiceSearchTerm('');
    setPets([]);
    setServices([]);
    setRecordResult(null);
  };

  // Limpar serviços quando pet for alterado
  const handlePetSelection = (pet: Pet) => {
    setSelectedPet(pet);
    setSelectedService(null); // Limpar serviço selecionado
    setServices([]); // Limpar lista de serviços
    setServiceSearchTerm(''); // Limpar busca de serviços
    
    // Se o pet não tem plano, mostrar toast informativo
    // if (!pet.plano) {
    //   toast({
    //     title: "Pet sem plano ativo",
    //     description: "Este pet não possui assinatura ativa. Será necessário ativar uma assinatura para registrar uso de serviços.",
    //     variant: "destructive",
    //   });
    // }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (duration >= 60) {
      const hours = Math.floor(duration / 60);
      const minutes = duration % 60;
      return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
    }
    return `${duration}min`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registrar Uso Manual de Serviço</DialogTitle>
        </DialogHeader>

        {recordResult ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Serviço registrado com sucesso!</span>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes do Registro</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Pet</Label>
                    <p className="text-sm">{selectedPet?.nome}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Serviço</Label>
                    <p className="text-sm">{selectedService?.name}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Usos Restantes</Label>
                    <p className="text-sm font-medium text-blue-600">{recordResult.remaining?.remaining || 'N/A'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Total de Usos</Label>
                    <p className="text-sm font-medium text-green-600">{recordResult.remaining?.total || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Seleção de Pet */}
            <div className="space-y-3">
              <Label htmlFor="pet-search">Selecionar Pet</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="pet-search"
                  placeholder="Pesquisar pet por nome, raça ou dono..."
                  value={petSearchTerm}
                  onChange={(e) => setPetSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {isSearchingPets && (
                  <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                )}
              </div>

              {pets.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {pets.map((pet) => (
                    <Card
                      key={pet.id_pet}
                      className={`cursor-pointer transition-colors ${
                        selectedPet?.id_pet === pet.id_pet
                          ? 'border-blue-500 bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                                             onClick={() => handlePetSelection(pet)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{pet.nome}</p>
                            <p className="text-xs text-gray-500">{pet.raca} • {pet.tipo_animal}</p>
                            <p className="text-xs text-gray-400">Dono: {pet.user.name}</p>
                          </div>
                          {selectedPet?.id_pet === pet.id_pet && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

                             {selectedPet && (
                 <Card className="border-green-200 bg-green-50">
                   <CardContent className="p-3">
                     <div className="space-y-2">
                       <div className="flex items-center gap-2">
                         <CheckCircle className="h-4 w-4 text-green-600" />
                         <div>
                           <p className="font-medium text-sm text-green-800">{selectedPet.nome}</p>
                           <p className="text-xs text-green-600">Pet selecionado</p>
                         </div>
                       </div>
                       
                                               {selectedPet.plano ? (
                          <div className="border-t pt-2">
                            <p className="text-xs font-medium text-gray-700">Plano Ativo:</p>
                            <p className="text-xs text-gray-600">{selectedPet.plano.name}</p>
                            <p className="text-xs text-gray-500">{selectedPet.plano.description}</p>
                          </div>
                        ) : (
                          <div className="border-t pt-2">
                            <p className="text-xs text-orange-600 font-medium">⚠️ Sem plano ativo</p>
                            <p className="text-xs text-gray-500">Este pet não possui assinatura ativa</p>
                            <p className="text-xs text-orange-500 mt-1">
                              <strong>Limitação:</strong> Não será possível registrar uso de serviços
                            </p>
                          </div>
                        )}
                     </div>
                   </CardContent>
                 </Card>
               )}
            </div>

                         {/* Seleção de Serviço */}
             <div className="space-y-3">
               <Label htmlFor="service-search">Selecionar Serviço</Label>
                               {!selectedPet ? (
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500 text-center">
                      Selecione um pet primeiro para buscar serviços disponíveis
                    </p>
                  </div>
                ) : !selectedPet.plano ? (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 text-center font-medium">
                      ⚠️ Pet sem plano ativo
                    </p>
                    <p className="text-xs text-red-500 text-center mt-1">
                      Este pet não possui assinatura ativa para buscar serviços
                    </p>
                  </div>
                ) : (
                 <>
                   <div className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                     <Input
                       id="service-search"
                       placeholder="Pesquisar serviço por nome, tipo ou categoria..."
                       value={serviceSearchTerm}
                       onChange={(e) => setServiceSearchTerm(e.target.value)}
                       className="pl-10"
                       disabled={!selectedPet || !selectedPet.plano}
                     />
                     {isSearchingServices && (
                       <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
                     )}
                   </div>
                 </>
               )}

                             {services.length > 0 && (
                 <div className="space-y-2 max-h-40 overflow-y-auto">
                   {services.map((service) => (
                     <Card
                       key={service.id}
                       className={`cursor-pointer transition-colors ${
                         selectedService?.id === service.id
                           ? 'border-blue-500 bg-blue-50'
                           : 'hover:bg-gray-50'
                       }`}
                       onClick={() => setSelectedService(service)}
                     >
                       <CardContent className="p-3">
                         <div className="flex items-center justify-between">
                           <div className="flex-1">
                             <p className="font-medium text-sm">{service.name}</p>
                             <p className="text-xs text-gray-500 line-clamp-2">{service.description}</p>
                             <div className="flex items-center gap-2 mt-1">
                               <Badge variant="outline" className="text-xs">
                                 {service.type}
                               </Badge>
                               <Badge variant="outline" className="text-xs">
                                 {service.category}
                               </Badge>
                             </div>
                             <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                               <span>Duração: {formatDuration(service.duration)}</span>
                               <span>Preço: {formatPrice(service.price)}</span>
                             </div>
                           </div>
                           {selectedService?.id === service.id && (
                             <CheckCircle className="h-4 w-4 text-blue-500 ml-2" />
                           )}
                         </div>
                       </CardContent>
                     </Card>
                   ))}
                 </div>
               )}

               {selectedPet && services.length === 0 && serviceSearchTerm && (
                 <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                   <p className="text-sm text-gray-500 text-center">
                     Nenhum serviço encontrado para "{serviceSearchTerm}"
                   </p>
                 </div>
               )}

               {selectedPet && !serviceSearchTerm && (
                 <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                   <p className="text-sm text-blue-600 text-center">
                     Digite algo para buscar serviços disponíveis para {selectedPet.nome}
                   </p>
                 </div>
               )}

              {selectedService && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium text-sm text-green-800">{selectedService.name}</p>
                        <p className="text-xs text-green-600">Serviço selecionado</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Observações */}
            <div className="space-y-3">
              <Label htmlFor="notes">Observações (opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Adicione observações sobre o serviço prestado..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {/* Aviso */}
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Atenção</p>
                <p>Este registro será descontado da assinatura ativa do pet. Certifique-se de que o serviço foi realmente prestado.</p>
              </div>
            </div>

                         {/* Botões */}
             <div className="space-y-3">
               {/* Mensagem de aviso quando não há plano */}
               {selectedPet && !selectedPet.plano && (
                 <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                   <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                   <div className="text-sm text-red-800">
                     <p className="font-medium">Plano necessário</p>
                     <p>Este pet precisa de uma assinatura ativa para registrar uso de serviços.</p>
                   </div>
                 </div>
               )}
               
               <div className="flex justify-end gap-3">
                 <Button
                   variant="outline"
                   onClick={() => setIsOpen(false)}
                   disabled={isRecording}
                 >
                   Cancelar
                 </Button>
                 <Button
                   onClick={recordServiceUsage}
                   disabled={!selectedPet || !selectedService || isRecording || !selectedPet.plano}
                   className="min-w-[120px]"
                 >
                   {isRecording ? (
                     <>
                       <Loader2 className="h-4 w-4 animate-spin mr-2" />
                       Registrando...
                     </>
                   ) : (
                     'Registrar Uso'
                   )}
                 </Button>
               </div>
             </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
