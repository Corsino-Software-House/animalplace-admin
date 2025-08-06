import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Edit, Trash2, Check, AlertCircle } from 'lucide-react';
import { usePlanById } from '@/hooks/usePlans';
import { Plan } from '@/types/plans';
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
      <DialogContent className="sm:max-w-[900px] max-h-[95vh] overflow-y-auto mx-4 sm:mx-0">
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
          <div className="space-y-6">
            {/* Header com status */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: plan.mainColor }}
                />
                <Badge 
                  variant={plan.isActive ? 'default' : 'secondary'}
                  style={plan.isActive ? { backgroundColor: '#95CA3C', color: 'white' } : {}}
                  className="text-sm"
                >
                  {plan.isActive ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>

            {/* Informações básicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(plan.suggestedPrice)}
                  </div>
                  <p className="text-sm text-gray-600">Preço Sugerido</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {plan.duration}
                  </div>
                  <p className="text-sm text-gray-600">Dias de Duração</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {plan.services?.length || 0}
                  </div>
                  <p className="text-sm text-gray-600">Serviços Inclusos</p>
                </CardContent>
              </Card>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Descrição</h4>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {plan.description}
              </p>
            </div>

            {/* Limites de Serviços */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Limites de Serviços</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(plan.serviceLimits).map(([serviceType, limits]) => (
                  <Card key={serviceType}>
                    <CardContent className="p-4">
                      <h5 className="font-medium mb-2">
                        {serviceTypeLabels[serviceType as keyof typeof serviceTypeLabels]}
                      </h5>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Limite:</strong> {limits.limit}x por {periodLabels[limits.period]}</p>
                        <p><strong>Carência:</strong> {limits.carencyDays} dias</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Serviços Permitidos */}
            {plan.allowedServiceNames && plan.allowedServiceNames.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Serviços Permitidos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {plan.allowedServiceNames.map((serviceName, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{serviceName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Serviços Personalizados */}
            {plan.servicesToCreate && plan.servicesToCreate.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Serviços Personalizados</h4>
                <div className="space-y-3">
                  {plan.servicesToCreate.map((service, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium">{service.name}</h5>
                          <span className="text-sm font-semibold text-green-600">
                            {formatPrice(service.price)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>Duração: {service.duration}min</span>
                          <span>Tipo: {service.type}</span>
                          <span>Categoria: {service.category}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Regras Especiais */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Regras Especiais</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${plan.specialRules.microchipFree ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Microchip gratuito</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${plan.specialRules.aestheticViaApp ? 'bg-green-500' : 'bg-gray-300'}`} />
                  <span className="text-sm">Serviços estéticos via app</span>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <EditPlanModal 
                plan={plan}
                trigger={
                  <Button className="w-full sm:flex-1" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Plano
                  </Button>
                }
              />
              <DeletePlanDialog 
                plan={plan}
                trigger={
                  <Button className="w-full sm:flex-1" variant="outline">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Plano
                  </Button>
                }
              />
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
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