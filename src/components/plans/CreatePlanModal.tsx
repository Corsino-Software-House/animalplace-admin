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
import { Plus, ArrowLeft, ArrowRight, X, Check } from 'lucide-react';
import { useCreatePlan } from '@/hooks/usePlans';
import { Plan, ServiceLimit, ServiceToCreate, Period } from '@/types/plans';

interface CreatePlanModalProps {
  trigger?: React.ReactNode;
}

const defaultServiceLimits: Plan['serviceLimits'] = {
  consultation: { limit: 1, period: 'month', carencyDays: 0 },
  vaccine: { limit: 1, period: 'year', carencyDays: 0 },
  exam: { limit: 1, period: 'year', carencyDays: 0 },
  procedure: { limit: 1, period: 'year', carencyDays: 0 },
  surgery: { limit: 1, period: 'year', carencyDays: 30 },
  anesthesia: { limit: 1, period: 'year', carencyDays: 0 },
  hospitalization: { limit: 1, period: 'year', carencyDays: 0 },
  bath_and_grooming: { limit: 1, period: 'month', carencyDays: 0 },
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

const availableServices = [
  "Consulta Clínica Geral",
  "Consulta Plantão",
  "Consulta Domiciliar",
  "Telemedicina",
  "Consulta Especialista",
  "Consulta Cardiologia",
  "Consulta Ortopedia",
  "Consulta Odontologia",
  "Consulta Oncologia",
  "Consulta Fisioterapia",
  "Consulta Acupuntura",
  "Vacina Polivalente (V10/V4)",
  "Vacina Gripe (Bordetella)",
  "Vacina Raiva",
  "Vacina Giardia",
  "Microchipagem",
];

export function CreatePlanModal({ trigger }: CreatePlanModalProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState<Omit<Plan, 'id'>>({
    name: '',
    description: '',
    suggestedPrice: 0,
    duration: 30,
    isActive: true,
    mainColor: '#95CA3C',
    serviceLimits: defaultServiceLimits,
    allowedServiceNames: [],
    servicesToCreate: [],
    specialRules: {
      microchipFree: false,
      aestheticViaApp: false,
      consultationTypes: {},
    },
  });

  const createMutation = useCreatePlan();

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      name: '',
      description: '',
      suggestedPrice: 0,
      duration: 30,
      isActive: true,
      mainColor: '#95CA3C',
      serviceLimits: defaultServiceLimits,
      allowedServiceNames: [],
      servicesToCreate: [],
      specialRules: {
        microchipFree: false,
        aestheticViaApp: false,
        consultationTypes: {},
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

  const addServiceToCreate = () => {
    const newService: ServiceToCreate = {
      name: '',
      description: '',
      price: 0,
      duration: 30,
      type: 'consultation',
      category: 'clinical',
      isActive: true,
      defaultLimits: { limit: 1, period: 'month', carencyDays: 0 },
    };
    
    setFormData(prev => ({
      ...prev,
      servicesToCreate: [...(prev.servicesToCreate || []), newService],
    }));
  };

  const updateServiceToCreate = (index: number, field: keyof ServiceToCreate, value: any) => {
    setFormData(prev => ({
      ...prev,
      servicesToCreate: prev.servicesToCreate?.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      ) || [],
    }));
  };

  const removeServiceToCreate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      servicesToCreate: prev.servicesToCreate?.filter((_, i) => i !== index) || [],
    }));
  };

  const toggleAllowedService = (serviceName: string) => {
    setFormData(prev => ({
      ...prev,
      allowedServiceNames: prev.allowedServiceNames?.includes(serviceName)
        ? prev.allowedServiceNames.filter(name => name !== serviceName)
        : [...(prev.allowedServiceNames || []), serviceName],
    }));
  };

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
      <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Criar Novo Plano - Etapa {currentStep} de 4
          </DialogTitle>
          <div className="flex space-x-2 mt-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded ${
                  step <= currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Etapa 1: Informações Básicas */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          )}

          {/* Etapa 2: Limites de Serviços */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Limites de Serviços</h3>
              
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(formData.serviceLimits).map(([serviceType, limits]) => (
                  <Card key={serviceType}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">
                        {serviceTypeLabels[serviceType as keyof typeof serviceTypeLabels]}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Limite</Label>
                          <Input
                            type="number"
                            min="0"
                            value={limits.limit}
                            onChange={(e) => updateServiceLimit(
                              serviceType as keyof Plan['serviceLimits'],
                              'limit',
                              parseInt(e.target.value) || 0
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Período</Label>
                          <Select
                            value={limits.period}
                            onValueChange={(value: Period) => updateServiceLimit(
                              serviceType as keyof Plan['serviceLimits'],
                              'period',
                              value
                            )}
                          >
                            <SelectTrigger>
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
                          <Label>Carência (dias)</Label>
                          <Input
                            type="number"
                            min="0"
                            value={limits.carencyDays}
                            onChange={(e) => updateServiceLimit(
                              serviceType as keyof Plan['serviceLimits'],
                              'carencyDays',
                              parseInt(e.target.value) || 0
                            )}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Etapa 3: Serviços Permitidos */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Serviços Permitidos</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableServices.map((service) => (
                  <div
                    key={service}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      formData.allowedServiceNames?.includes(service)
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => toggleAllowedService(service)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{service}</span>
                      {formData.allowedServiceNames?.includes(service) && (
                        <Check className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">Serviços Personalizados</h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addServiceToCreate}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Serviço
                  </Button>
                </div>

                <div className="space-y-4">
                  {formData.servicesToCreate?.map((service, index) => (
                    <Card key={index}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base">Serviço Personalizado {index + 1}</CardTitle>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeServiceToCreate(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Nome do serviço"
                            value={service.name}
                            onChange={(e) => updateServiceToCreate(index, 'name', e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Preço"
                            value={service.price}
                            onChange={(e) => updateServiceToCreate(index, 'price', parseFloat(e.target.value) || 0)}
                          />
                          <Input
                            placeholder="Descrição"
                            value={service.description}
                            onChange={(e) => updateServiceToCreate(index, 'description', e.target.value)}
                          />
                          <Input
                            type="number"
                            placeholder="Duração (min)"
                            value={service.duration}
                            onChange={(e) => updateServiceToCreate(index, 'duration', parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Etapa 4: Regras Especiais */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Regras Especiais</h3>
              
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

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Resumo do Plano</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Nome:</strong> {formData.name}</p>
                  <p><strong>Preço:</strong> R$ {formData.suggestedPrice.toFixed(2)}</p>
                  <p><strong>Duração:</strong> {formData.duration} dias</p>
                  <p><strong>Serviços Permitidos:</strong> {formData.allowedServiceNames?.length || 0}</p>
                  <p><strong>Serviços Personalizados:</strong> {formData.servicesToCreate?.length || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={currentStep === 1 ? () => setOpen(false) : prevStep}
          >
            {currentStep === 1 ? 'Cancelar' : (
              <>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
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
              className="text-white hover:opacity-90"
            >
              Próximo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={createMutation.isPending}
              style={{ backgroundColor: '#95CA3C' }}
              className="text-white hover:opacity-90"
            >
              {createMutation.isPending ? 'Criando...' : 'Criar Plano'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}