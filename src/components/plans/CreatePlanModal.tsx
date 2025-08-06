import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ArrowLeft, ArrowRight, Check, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useCreatePlan } from '@/hooks/usePlans';
import { useServices } from '@/hooks/useServices';
import { Plan, ServiceLimit, Period } from '@/types/plans';

interface CreatePlanModalProps {
  trigger?: React.ReactNode;
}

const defaultServiceLimits: Plan['serviceLimits'] = {
  consultation: { limit: 1, period: 'month', carencyDays: 0 },
  vaccine: { limit: 1, period: 'year', carencyDays: 0 },
};

const serviceTypeLabels = {
  consultation: 'Consultas',
  vaccine: 'Vacinas',
  exam: 'Exames',
  procedure: 'Procedimentos',
  surgery: 'Cirurgias',
  anesthesia: 'Anestesias',
  hospitalization: 'Internações',
  bath_and_grooming: 'Banho e Tosa',
};

// Função para traduzir categorias de serviço
const getCategoryLabel = (category: string) => {
  const categoryLabels: Record<string, string> = {
    clinical: 'Clínico',
    preventive: 'Preventivo',
    diagnostic: 'Diagnóstico',
    surgical: 'Cirúrgico',
    aesthetic: 'Estético',
    therapeutic: 'Terapêutico',
    emergency: 'Emergência',
  };
  return categoryLabels[category] || category;
};

// Função para agrupar serviços por categoria
const groupServicesByCategory = (services: any[]) => {
  return services.reduce((groups: Record<string, any[]>, service: any) => {
    const category = service.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(service);
    return groups;
  }, {} as Record<string, any[]>);
};

export function CreatePlanModal({ trigger }: CreatePlanModalProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  
  // Buscar serviços da API
  const { data: services = [], isLoading: servicesLoading } = useServices();
  
  const [formData, setFormData] = useState<Omit<Plan, 'id'>>({
    name: '',
    description: '',
    suggestedPrice: 0,
    duration: 30,
    isActive: true,
    mainColor: '#95CA3C',
    serviceIds: [],
    serviceLimits: defaultServiceLimits,
    freeServices: [],
    appPurchaseServices: [],
    specialRules: {
      microchipFree: false,
      aestheticViaApp: false,
    },
  });

  const createMutation = useCreatePlan();

  const resetForm = () => {
    setCurrentStep(1);
    setExpandedCategories({});
    setFormData({
      name: '',
      description: '',
      suggestedPrice: 0,
      duration: 30,
      isActive: true,
      mainColor: '#95CA3C',
      serviceIds: [],
      serviceLimits: defaultServiceLimits,
      freeServices: [],
      appPurchaseServices: [],
      specialRules: {
        microchipFree: false,
        aestheticViaApp: false,
      },
    });
  };

  const handleSubmit = () => {
    createMutation.mutate(formData, {
      onSuccess: () => {
        setOpen(false);
        resetForm();
      },
    });
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const updateServiceLimit = (serviceType: keyof Plan['serviceLimits'], field: keyof ServiceLimit, value: number | Period) => {
    setFormData(prev => ({
      ...prev,
      serviceLimits: {
        ...prev.serviceLimits,
        [serviceType]: {
          ...prev.serviceLimits[serviceType],
          [field]: value,
        },
      },
    }));
  };

  const toggleService = (serviceId: string, type: 'serviceIds' | 'freeServices' | 'appPurchaseServices') => {
    setFormData(prev => {
      const currentList = prev[type] || [];
      const isSelected = currentList.includes(serviceId);
      
      return {
        ...prev,
        [type]: isSelected
          ? currentList.filter(id => id !== serviceId)
          : [...currentList, serviceId],
      };
    });
  };

  const toggleCategoryExpansion = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Agrupar serviços por categoria
  const servicesByCategory = groupServicesByCategory(services);

  const defaultTrigger = (
    <Button style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90 w-full sm:w-auto">
      <Plus className="mr-2 h-4 w-4" />
      Criar Plano
    </Button>
  );

  const canProceedToStep2 = formData.name && formData.description && formData.suggestedPrice > 0;
  const canProceedToStep3 = true; // Service limits sempre podem prosseguir
  const canProceedToStep4 = true; // Services sempre podem prosseguir

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[800px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Criar Novo Plano - Etapa {currentStep} de 4
          </DialogTitle>
          <div className="flex space-x-1 sm:space-x-2 mt-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-1.5 sm:h-2 flex-1 rounded ${
                  step <= currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
          {/* Etapa 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Plano *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ex: Plano Premium"
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
                    placeholder="99.90"
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
                  placeholder="Descrição detalhada do plano..."
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm">Duração (dias)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={formData.duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color" className="text-sm">Cor Principal</Label>
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
            </div>
          )}

          {/* Etapa 2: Limites de Serviços */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Limites de Serviços</h3>
              
              <div className="grid grid-cols-1 gap-3 sm:gap-4">
                {Object.entries(formData.serviceLimits).map(([serviceType, limits]) => (
                  <Card key={serviceType}>
                    <CardHeader className="pb-2 sm:pb-3">
                      <CardTitle className="text-sm sm:text-base">
                        {serviceTypeLabels[serviceType as keyof typeof serviceTypeLabels]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm">Limite</Label>
                          <Input
                            type="number"
                            min="0"
                            value={limits.limit}
                            onChange={(e) => updateServiceLimit(
                              serviceType as keyof Plan['serviceLimits'],
                              'limit',
                              parseInt(e.target.value) || 0
                            )}
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm">Período</Label>
                          <Select
                            value={limits.period}
                            onValueChange={(value: Period) => updateServiceLimit(
                              serviceType as keyof Plan['serviceLimits'],
                              'period',
                              value
                            )}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="day">Dia</SelectItem>
                              <SelectItem value="week">Semana</SelectItem>
                              <SelectItem value="month">Mês</SelectItem>
                              <SelectItem value="year">Ano</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs sm:text-sm">Carência (dias)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={limits.carencyDays}
                            onChange={(e) => updateServiceLimit(
                              serviceType as keyof Plan['serviceLimits'],
                              'carencyDays',
                              parseInt(e.target.value) || 0
                            )}
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Etapa 3: Seleção de Serviços */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Seleção de Serviços</h3>
              
              {servicesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Carregando serviços...</span>
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhum serviço encontrado.</p>
                  <p className="text-sm">Crie alguns serviços primeiro para poder incluí-los nos planos.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Organize os serviços por categoria e defina como serão oferecidos no plano.
                  </p>
                  
                  <div className="space-y-2 sm:space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
                    {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                      <div key={category} className="border rounded-lg">
                        <button
                          type="button"
                          className="w-full flex items-center justify-between p-2 sm:p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                          onClick={() => toggleCategoryExpansion(category)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm sm:text-base">{getCategoryLabel(category)}</span>
                            <Badge variant="secondary" className="text-xs">
                              {categoryServices.length} serviços
                            </Badge>
                          </div>
                          {expandedCategories[category] ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                        
                        {expandedCategories[category] && (
                          <div className="p-2 sm:p-3 border-t bg-white">
                            <div className="space-y-2 sm:space-y-3">
                              {categoryServices.map((service) => (
                                <div key={service.id} className="border rounded-lg p-2 sm:p-3">
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-medium text-xs sm:text-sm truncate">{service.name}</h4>
                                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{service.description}</p>
                                      <div className="flex items-center gap-2 sm:gap-3 mt-2 text-xs text-gray-500">
                                        <span>R$ {Number(service.price).toFixed(2)}</span>
                                        <span>{service.duration}min</span>
                                        <span className={service.isActive ? 'text-green-600' : 'text-red-600'}>
                                          {service.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="flex flex-col sm:flex-row flex-wrap gap-1 sm:gap-2">
                                    <button
                                      type="button"
                                      className={`px-3 py-1 rounded text-xs transition-colors ${
                                        formData.serviceIds?.includes(service.id)
                                          ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                      }`}
                                      onClick={() => toggleService(service.id, 'serviceIds')}
                                    >
                                      {formData.serviceIds?.includes(service.id) && <Check className="inline h-3 w-3 mr-1" />}
                                      Incluir no Plano
                                    </button>
                                    
                                    <button
                                      type="button"
                                      className={`px-3 py-1 rounded text-xs transition-colors ${
                                        formData.freeServices?.includes(service.id)
                                          ? 'bg-green-100 text-green-700 border border-green-300'
                                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                      }`}
                                      onClick={() => toggleService(service.id, 'freeServices')}
                                    >
                                      {formData.freeServices?.includes(service.id) && <Check className="inline h-3 w-3 mr-1" />}
                                      Gratuito
                                    </button>
                                    
                                    <button
                                      type="button"
                                      className={`px-3 py-1 rounded text-xs transition-colors ${
                                        formData.appPurchaseServices?.includes(service.id)
                                          ? 'bg-purple-100 text-purple-700 border border-purple-300'
                                          : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                      }`}
                                      onClick={() => toggleService(service.id, 'appPurchaseServices')}
                                    >
                                      {formData.appPurchaseServices?.includes(service.id) && <Check className="inline h-3 w-3 mr-1" />}
                                      Compra no App
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg text-xs sm:text-sm">
                    <div className="text-center sm:text-left">
                      <span className="font-medium text-blue-700">Incluídos:</span>
                      <span className="ml-1 sm:ml-2">{formData.serviceIds?.length || 0}</span>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="font-medium text-green-700">Gratuitos:</span>
                      <span className="ml-1 sm:ml-2">{formData.freeServices?.length || 0}</span>
                    </div>
                    <div className="text-center sm:text-left">
                      <span className="font-medium text-purple-700">Compra no App:</span>
                      <span className="ml-1 sm:ml-2">{formData.appPurchaseServices?.length || 0}</span>
                    </div>
                  </div>
                </div>
              )}


            </div>
          )}

          {/* Etapa 4: Regras Especiais */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Regras Especiais</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="microchipFree"
                    checked={formData.specialRules.microchipFree}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      specialRules: { ...prev.specialRules, microchipFree: checked }
                    }))}
                  />
                  <Label htmlFor="microchipFree">Microchip gratuito</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="aestheticViaApp"
                    checked={formData.specialRules.aestheticViaApp}
                    onCheckedChange={(checked) => setFormData(prev => ({
                      ...prev,
                      specialRules: { ...prev.specialRules, aestheticViaApp: checked }
                    }))}
                  />
                  <Label htmlFor="aestheticViaApp">Serviços estéticos via app</Label>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2 sm:mb-3 text-sm sm:text-base">Resumo do Plano</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="space-y-1 sm:space-y-2">
                    <p><strong>Nome:</strong> {formData.name}</p>
                    <p><strong>Preço:</strong> R$ {formData.suggestedPrice.toFixed(2)}</p>
                    <p><strong>Duração:</strong> {formData.duration} dias</p>
                    <p><strong>Status:</strong> {formData.isActive ? 'Ativo' : 'Inativo'}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p><strong>Serviços Incluídos:</strong> {formData.serviceIds?.length || 0}</p>
                    <p><strong>Serviços Gratuitos:</strong> {formData.freeServices?.length || 0}</p>
                    <p><strong>Compra no App:</strong> {formData.appPurchaseServices?.length || 0}</p>
                    <p><strong>Microchip Grátis:</strong> {formData.specialRules.microchipFree ? 'Sim' : 'Não'}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-0 pt-3 sm:pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 1 ? () => setOpen(false) : prevStep}
            className="w-full sm:w-auto text-sm"
          >
            {currentStep === 1 ? 'Cancelar' : (
              <>
                <ArrowLeft className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Anterior</span>
                <span className="sm:hidden">Voltar</span>
              </>
            )}
          </Button>

          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={
                (currentStep === 1 && !canProceedToStep2) ||
                (currentStep === 2 && !canProceedToStep3) ||
                (currentStep === 3 && !canProceedToStep4)
              }
              style={{ backgroundColor: '#95CA3C' }}
              className="text-white hover:opacity-90 w-full sm:w-auto text-sm"
            >
              <span className="hidden sm:inline">Próximo</span>
              <span className="sm:hidden">Continuar</span>
              <ArrowRight className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              style={{ backgroundColor: '#95CA3C' }}
              className="text-white hover:opacity-90 w-full sm:w-auto text-sm"
            >
              {createMutation.isPending ? 'Criando...' : 'Criar Plano'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}