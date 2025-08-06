import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Edit, Trash2, Check, AlertCircle } from 'lucide-react';
import { usePlanById } from '@/hooks/usePlans';
import { useServices } from '@/hooks/useServices';
import { EditPlanModal } from './EditPlanModal';
import { DeletePlanDialog } from './DeletePlanDialog';

interface PlanDetailsModalProps {
  planId: string;
  trigger?: React.ReactNode;
}

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

const periodLabels = {
  day: 'Dia',
  week: 'Semana',
  month: 'Mês',
  year: 'Ano',
};

// Função para formatar preço
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export function PlanDetailsModal({ planId, trigger }: PlanDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const { data: plan, isLoading, error } = usePlanById(planId, open);
  const { data: services = [] } = useServices();

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Eye className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[900px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {isLoading ? 'Carregando...' : plan?.name || 'Detalhes do Plano'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-6 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar plano</h3>
              <p className="text-gray-600">Não foi possível carregar os detalhes do plano.</p>
            </div>
          </div>
        ) : plan ? (
          <div className="space-y-4 sm:space-y-6 px-1 sm:px-0">
            {/* Header com status */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <div
                  className="w-3 h-3 sm:w-4 sm:h-4 rounded-full"
                  style={{ backgroundColor: plan.mainColor }}
                />
                <Badge 
                  variant={plan.isActive ? 'default' : 'secondary'}
                  style={plan.isActive ? { backgroundColor: '#95CA3C', color: 'white' } : {}}
                  className="text-xs sm:text-sm"
                >
                  {plan.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>

            {/* Informações básicas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-green-600">
                    {formatPrice(plan.suggestedPrice)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Preço Sugerido</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-blue-600">
                    {plan.duration}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Dias de Duração</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="text-lg sm:text-2xl font-bold text-purple-600">
                    {(plan.serviceIds?.length || 0) + (plan.freeServices?.length || 0)}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">Serviços Inclusos</p>
                </CardContent>
              </Card>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Descrição</h4>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                {plan.description}
              </p>
            </div>

            {/* Limites de Serviços */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Limites de Serviços</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
                {Object.entries(plan.serviceLimits).map(([serviceType, limits]) => (
                  <Card key={serviceType}>
                    <CardContent className="p-3 sm:p-4">
                      <h5 className="font-medium mb-1 sm:mb-2 text-xs sm:text-sm">
                        {serviceTypeLabels[serviceType as keyof typeof serviceTypeLabels]}
                      </h5>
                      <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                        <p><strong>Limite:</strong> {limits.limit}x por {periodLabels[limits.period]}</p>
                        <p><strong>Carência:</strong> {limits.carencyDays} dias</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Serviços Incluídos no Plano */}
            {plan.serviceIds && plan.serviceIds.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">Serviços Incluídos no Plano ({plan.serviceIds.length})</h4>
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {plan.serviceIds.map((serviceId, index) => {
                    const service = services.find(s => s.id === serviceId);
                    return (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <span className="font-medium text-xs sm:text-sm truncate">{service?.name || serviceId}</span>
                            {service && (
                              <div className="flex gap-1 sm:gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {service.type}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {service.category}
                                </Badge>
                              </div>
                            )}
                          </div>
                          {service && (
                            <>
                              <p className="text-xs text-gray-600 mb-1 line-clamp-2">{service.description}</p>
                              <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                                <span>R$ {Number(service.price).toFixed(2)}</span>
                                <span>{service.duration}min</span>
                                <span className={service.isActive ? 'text-green-600' : 'text-red-600'}>
                                  {service.isActive ? 'Ativo' : 'Inativo'}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Serviços Gratuitos */}
            {plan.freeServices && plan.freeServices.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">Serviços Gratuitos ({plan.freeServices.length})</h4>
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {plan.freeServices.map((serviceId, index) => {
                    const service = services.find(s => s.id === serviceId);
                    return (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg border border-green-200">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <span className="font-medium text-xs sm:text-sm truncate">{service?.name || serviceId}</span>
                            <div className="flex gap-1 sm:gap-2">
                              <Badge className="text-xs bg-green-100 text-green-700">Gratuito</Badge>
                              {service && (
                                <Badge variant="secondary" className="text-xs">
                                  {service.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {service && (
                            <>
                              <p className="text-xs text-gray-600 mb-1 line-clamp-2">{service.description}</p>
                              <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                                <span className="line-through">R$ {Number(service.price).toFixed(2)}</span>
                                <span>{service.duration}min</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Serviços para Compra no App */}
            {plan.appPurchaseServices && plan.appPurchaseServices.length > 0 && (
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-medium text-gray-900 text-sm sm:text-base">Serviços para Compra no App ({plan.appPurchaseServices.length})</h4>
                <div className="grid grid-cols-1 gap-2 sm:gap-3">
                  {plan.appPurchaseServices.map((serviceId, index) => {
                    const service = services.find(s => s.id === serviceId);
                    return (
                      <div key={index} className="flex items-start gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 rounded-lg border border-purple-200">
                        <Check className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                            <span className="font-medium text-xs sm:text-sm truncate">{service?.name || serviceId}</span>
                            <div className="flex gap-1 sm:gap-2">
                              <Badge className="text-xs bg-purple-100 text-purple-700">Compra no App</Badge>
                              {service && (
                                <Badge variant="secondary" className="text-xs">
                                  {service.category}
                                </Badge>
                              )}
                            </div>
                          </div>
                          {service && (
                            <>
                              <p className="text-xs text-gray-600 mb-1 line-clamp-2">{service.description}</p>
                              <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                                <span>R$ {Number(service.price).toFixed(2)}</span>
                                <span>{service.duration}min</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Regras Especiais */}
            <div className="space-y-3 sm:space-y-4">
              <h4 className="font-medium text-gray-900 text-sm sm:text-base">Regras Especiais</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${plan.specialRules.microchipFree ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-xs sm:text-sm">Microchip gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${plan.specialRules.aestheticViaApp ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-xs sm:text-sm">Serviços estéticos via app</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t">
              <EditPlanModal 
                plan={plan}
                trigger={
                  <Button className="w-full sm:flex-1 text-xs sm:text-sm" variant="outline">
                    <Edit className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Editar Plano
                  </Button>
                }
              />
              <DeletePlanDialog 
                plan={plan}
                trigger={
                  <Button className="w-full sm:flex-1 text-xs sm:text-sm" variant="outline">
                    <Trash2 className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    Excluir Plano
                  </Button>
                }
              />
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                Fechar
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}