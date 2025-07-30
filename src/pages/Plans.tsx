import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Plus, MoreHorizontal, Edit, Trash2, Check, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getPlans } from '@/services/plans-service';

export function Plans() {
  const {
    data: plans = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['plans'],
    queryFn: async () => {
      const plansData = await getPlans();
      return Array.isArray(plansData) ? plansData : [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Carregando planos...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {error instanceof Error ? error.message : 'Erro ao carregar os planos'}
          </p>
          <Button onClick={() => refetch()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">Gerenciamento de Planos</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Crie e gerencie planos de assinatura para sua plataforma</p>
        </div>
        <Button 
          style={{ backgroundColor: '#95CA3C' }} 
          className="text-white hover:opacity-90 w-full sm:w-auto shrink-0"
        >
          <Plus className="mr-2 h-4 w-4" />
          Criar Plano
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {plans.filter(plan => plan && plan.id).map((plan) => (
          <Card key={plan.id} className="relative flex flex-col h-full" style={{ borderColor: plan.mainColor }}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-lg sm:text-xl truncate">{plan.name}</CardTitle>
                  <div className="mt-2">
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1">
                      <span className="text-2xl sm:text-3xl font-bold">{plan.suggestedPrice}</span>
                      <span className="text-gray-500 text-sm">/{plan.duration} dias</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2 shrink-0">
                  <Badge 
                    variant={plan.isActive ? 'default' : 'secondary'}
                    style={plan.isActive ? { backgroundColor: '#95CA3C', color: 'white' } : {}}
                    className="text-xs"
                  >
                    {plan.isActive ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 bg-transparent">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Editar Plano
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Excluir Plano
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="text-xs sm:text-sm text-gray-600">
                  <p className="overflow-hidden text-ellipsis" style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>{plan.description}</p>
                </div>
                
                {plan.freeServices && plan.freeServices.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm font-medium">Serviços Gratuitos:</p>
                    <ul className="space-y-1">
                      {plan.freeServices.slice(0, 3).map((serviceId, index) => (
                        <li key={index} className="flex items-start text-xs sm:text-sm text-gray-600 gap-2">
                          <Check className="mt-0.5 h-3 w-3 shrink-0" style={{ color: '#95CA3C' }} />
                          <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                            {plan.services?.find(s => s.id === serviceId)?.name || serviceId}
                          </span>
                        </li>
                      ))}
                      {plan.freeServices.length > 3 && (
                        <li className="text-xs sm:text-sm text-gray-500 ml-5">
                          +{plan.freeServices.length - 3} mais serviços...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {plan.specialRules?.microchipFree && (
                  <div className="flex items-center text-xs sm:text-sm gap-2" style={{ color: plan.mainColor }}>
                    <Check className="h-3 w-3 shrink-0" />
                    <span>Microchip gratuito</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold">{plans.length}</div>
            <p className="text-xs sm:text-sm text-gray-600">Total de Planos</p>
            <p className="text-xs text-green-600 mt-1">
              {plans.filter(p => p.isActive).length} ativos
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold">
              {plans.reduce((acc, plan) => acc + (plan.services?.length || 0), 0)}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Total de Serviços</p>
            <p className="text-xs text-green-600 mt-1">
              Distribuídos entre os planos
            </p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2 lg:col-span-1">
          <CardContent className="pt-4 sm:pt-6">
            <div className="text-xl sm:text-2xl font-bold">
              {plans.reduce((acc, plan) => acc + (plan.freeServices?.length || 0), 0)}
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Serviços Gratuitos</p>
            <p className="text-xs text-green-600 mt-1">
              Disponíveis nos planos
            </p>
          </CardContent>
        </Card>
      </div>

      {plans.length === 0 && !isLoading && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 mb-4 text-sm sm:text-base">Nenhum plano encontrado</p>
          <Button 
            style={{ backgroundColor: '#95CA3C' }} 
            className="text-white hover:opacity-90 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            Criar Primeiro Plano
          </Button>
        </div>
      )}
    </div>
  );
}