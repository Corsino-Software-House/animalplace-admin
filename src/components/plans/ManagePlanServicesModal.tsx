import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Plus, 
  Minus, 
  Check, 
  X, 
  Search, 
  Loader2, 
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Info
} from 'lucide-react';
import { useServices } from '@/hooks/useServices';
import { useAddServicesToPlan, useRemoveServicesFromPlan, usePlanDependencies } from '@/hooks/usePlans';
import { Plan } from '@/types/plans';
import { Service } from '@/types/services';

interface ManagePlanServicesModalProps {
  plan: Plan;
  trigger?: React.ReactNode;
}

const getCategoryLabel = (category: string) => {
  const categoryLabels: Record<string, string> = {
    clinical: 'Clínico',
    preventive: 'Preventivo',
    diagnostic: 'Diagnóstico',
    surgical: 'Cirúrgico',
    aesthetic: 'Estético',
    therapeutic: 'Terapêutico',
    emergency: 'Emergência',
    vaccine: 'Vacina',
    transport: 'Transporte',
  };
  return categoryLabels[category] || category;
};

const groupServicesByCategory = (services: Service[]) => {
  return services.reduce((groups: Record<string, Service[]>, service: Service) => {
    const category = service.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(service);
    return groups;
  }, {} as Record<string, Service[]>);
};

export function ManagePlanServicesModal({ plan, trigger }: ManagePlanServicesModalProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'add' | 'remove'>('add');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  const { data: allServices = [], isLoading: servicesLoading } = useServices();
  const { data: dependencies } = usePlanDependencies(plan.id || '', open);
  const addMutation = useAddServicesToPlan();
  const removeMutation = useRemoveServicesFromPlan();

  // Serviços que já estão no plano
  const planServiceIds = useMemo(() => {
    // Se o plano tem services (array de objetos), extrair os IDs
    if (plan.services && Array.isArray(plan.services)) {
      const ids = plan.services.map(service => service.id);
      console.log('[ManagePlanServicesModal] Plan services found:', ids.length, 'services');
      return ids;
    }
    // Fallback para serviceIds se existir
    if (plan.serviceIds && Array.isArray(plan.serviceIds)) {
      console.log('[ManagePlanServicesModal] Plan serviceIds found:', plan.serviceIds.length, 'IDs');
      return plan.serviceIds;
    }
    console.log('[ManagePlanServicesModal] No services found in plan');
    return [];
  }, [plan.services, plan.serviceIds]);
  
  // Serviços disponíveis para adicionar (que não estão no plano)
  const availableToAdd = useMemo(() => {
    const available = allServices.filter(service => !planServiceIds.includes(service.id));
    console.log('[ManagePlanServicesModal] Available to add:', available.length, 'services');
    return available;
  }, [allServices, planServiceIds]);

  // Serviços do plano (para remover)
  const planServices = useMemo(() => {
    const inPlan = allServices.filter(service => planServiceIds.includes(service.id));
    console.log('[ManagePlanServicesModal] In plan:', inPlan.length, 'services');
    return inPlan;
  }, [allServices, planServiceIds]);

  // Filtragem por busca
  const filteredServices = useMemo(() => {
    const services = activeTab === 'add' ? availableToAdd : planServices;
    
    if (!searchTerm.trim()) return services;

    const term = searchTerm.toLowerCase();
    return services.filter(service =>
      service.name.toLowerCase().includes(term) ||
      service.description.toLowerCase().includes(term) ||
      getCategoryLabel(service.category).toLowerCase().includes(term)
    );
  }, [activeTab, availableToAdd, planServices, searchTerm]);

  const servicesByCategory = useMemo(() => {
    return groupServicesByCategory(filteredServices);
  }, [filteredServices]);

  const handleToggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSelectAll = () => {
    if (selectedServices.length === filteredServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(filteredServices.map(s => s.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedServices.length === 0) return;

    if (activeTab === 'add') {
      addMutation.mutate(
        { planId: plan.id!, serviceIds: selectedServices },
        {
          onSuccess: () => {
            setSelectedServices([]);
            setSearchTerm('');
            setOpen(false);
          },
        }
      );
    } else {
      removeMutation.mutate(
        { planId: plan.id!, serviceIds: selectedServices },
        {
          onSuccess: () => {
            setSelectedServices([]);
            setSearchTerm('');
            setOpen(false);
          },
        }
      );
    }
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const resetState = () => {
    setSearchTerm('');
    setSelectedServices([]);
    setActiveTab('add');
    setExpandedCategories({});
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Settings className="h-4 w-4 mr-2" />
      Gerenciar Serviços
    </Button>
  );

  const isPending = addMutation.isPending || removeMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetState();
    }}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[900px] max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Gerenciar Serviços - {plan.name}
          </DialogTitle>
          <DialogDescription>
            Adicione ou remova serviços deste plano. As alterações são aplicadas imediatamente a todas as assinaturas ativas.
          </DialogDescription>
        </DialogHeader>

        {/* Alertas de Informação */}
        <div className="space-y-2">
          {dependencies && dependencies.subscriptionsCount > 0 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>{dependencies.subscriptionsCount}</strong> assinatura(s) ativa(s) será(ão) afetada(s) pelas alterações.
              </AlertDescription>
            </Alert>
          )}

          {activeTab === 'remove' && planServices.length === 1 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Não é possível remover todos os serviços. O plano deve ter pelo menos 1 serviço.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value as 'add' | 'remove');
          setSelectedServices([]);
          setSearchTerm('');
        }} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar ({availableToAdd.length})
            </TabsTrigger>
            <TabsTrigger value="remove" className="flex items-center gap-2">
              <Minus className="h-4 w-4" />
              Remover ({planServices.length})
            </TabsTrigger>
          </TabsList>

          {/* Barra de Busca */}
          <div className="mt-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar serviços..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Seleção em Massa */}
            {filteredServices.length > 0 && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select-all"
                    checked={selectedServices.length === filteredServices.length}
                    onCheckedChange={handleSelectAll}
                  />
                  <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                    Selecionar todos ({filteredServices.length})
                  </label>
                </div>
                {selectedServices.length > 0 && (
                  <Badge variant="secondary">
                    {selectedServices.length} selecionado(s)
                  </Badge>
                )}
              </div>
            )}
          </div>

          <TabsContent value="add" className="flex-1 mt-4">
            {servicesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Carregando serviços...</span>
              </div>
            ) : availableToAdd.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Check className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p className="text-lg font-medium">Todos os serviços já estão neste plano!</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4" />
                <p>Nenhum serviço encontrado para "{searchTerm}"</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {Object.entries(servicesByCategory).map(([category, services]) => (
                    <div key={category} className="border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleCategoryExpansion(category)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {getCategoryLabel(category)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {services.length}
                          </Badge>
                        </div>
                        {expandedCategories[category] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      {expandedCategories[category] && (
                        <div className="p-2 space-y-2 bg-white">
                          {services.map((service) => (
                            <div
                              key={service.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                selectedServices.includes(service.id)
                                  ? 'border-green-500 bg-green-50'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleToggleService(service.id)}
                            >
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={selectedServices.includes(service.id)}
                                  onCheckedChange={() => handleToggleService(service.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">
                                    {service.name}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {service.description}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                    <span>R$ {Number(service.price).toFixed(2)}</span>
                                    <span>{service.duration}min</span>
                                    <Badge
                                      variant={service.isActive ? 'default' : 'secondary'}
                                      className="text-xs"
                                      style={
                                        service.isActive
                                          ? { backgroundColor: '#95CA3C', color: 'white' }
                                          : {}
                                      }
                                    >
                                      {service.isActive ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          <TabsContent value="remove" className="flex-1 mt-4">
            {servicesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Carregando serviços...</span>
              </div>
            ) : planServices.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                <p className="text-lg font-medium">Este plano não possui serviços</p>
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4" />
                <p>Nenhum serviço encontrado para "{searchTerm}"</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {Object.entries(servicesByCategory).map(([category, services]) => (
                    <div key={category} className="border rounded-lg overflow-hidden">
                      <button
                        type="button"
                        className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                        onClick={() => toggleCategoryExpansion(category)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">
                            {getCategoryLabel(category)}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {services.length}
                          </Badge>
                        </div>
                        {expandedCategories[category] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>

                      {expandedCategories[category] && (
                        <div className="p-2 space-y-2 bg-white">
                          {services.map((service) => (
                            <div
                              key={service.id}
                              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                                selectedServices.includes(service.id)
                                  ? 'border-red-500 bg-red-50'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleToggleService(service.id)}
                            >
                              <div className="flex items-start gap-3">
                                <Checkbox
                                  checked={selectedServices.includes(service.id)}
                                  onCheckedChange={() => handleToggleService(service.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">
                                    {service.name}
                                  </h4>
                                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                    {service.description}
                                  </p>
                                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                    <span>R$ {Number(service.price).toFixed(2)}</span>
                                    <span>{service.duration}min</span>
                                    <Badge
                                      variant={service.isActive ? 'default' : 'secondary'}
                                      className="text-xs"
                                      style={
                                        service.isActive
                                          ? { backgroundColor: '#95CA3C', color: 'white' }
                                          : {}
                                      }
                                    >
                                      {service.isActive ? 'Ativo' : 'Inativo'}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer com ações */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t">
          <div className="text-sm text-gray-600">
            {selectedServices.length > 0 && (
              <span>
                {selectedServices.length} serviço(s) selecionado(s)
              </span>
            )}
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                selectedServices.length === 0 ||
                isPending ||
                (activeTab === 'remove' && selectedServices.length === planServices.length)
              }
              style={{ backgroundColor: activeTab === 'add' ? '#95CA3C' : '#ef4444' }}
              className="text-white hover:opacity-90 flex-1 sm:flex-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {activeTab === 'add' ? (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar ({selectedServices.length})
                    </>
                  ) : (
                    <>
                      <Minus className="h-4 w-4 mr-2" />
                      Remover ({selectedServices.length})
                    </>
                  )}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}