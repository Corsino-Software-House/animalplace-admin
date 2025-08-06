import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, Check, Loader2, Search, X, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { usePlans } from '@/hooks/usePlans';
import { useDebounce } from '@/hooks/useDebounce';
import { CreatePlanModal } from '@/components/plans/CreatePlanModal';
import { EditPlanModal } from '@/components/plans/EditPlanModal';
import { DeletePlanDialog } from '@/components/plans/DeletePlanDialog';
import { PlanDetailsModal } from '@/components/plans/PlanDetailsModal';

// Função para formatar preço
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export function Plans() {
  const { data: plans = [], isLoading, error } = usePlans();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Debounce do termo de pesquisa (300ms de delay)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Indicador se está filtrando (para mostrar loading durante debounce)
  const isFiltering = searchTerm !== debouncedSearchTerm;

  // Filtrar planos baseado no termo de pesquisa com debounce
  const filteredPlans = useMemo(() => {
    if (!plans || !debouncedSearchTerm.trim()) return plans;

    const term = debouncedSearchTerm.toLowerCase().trim();
    return plans.filter(plan => 
      plan.name.toLowerCase().includes(term) ||
      plan.description.toLowerCase().includes(term) ||
      formatPrice(plan.suggestedPrice).toLowerCase().includes(term)
    );
  }, [plans, debouncedSearchTerm]);

  // Calcular estatísticas - usar planos filtrados
  const totalPlans = filteredPlans?.length || 0;
  const activePlans = filteredPlans?.filter(plan => plan.isActive).length || 0;
  const totalServices = filteredPlans?.reduce((acc, plan) => acc + (plan.serviceIds?.length || 0), 0) || 0;
  const totalFreeServices = filteredPlans?.reduce((acc, plan) => acc + (plan.freeServices?.length || 0), 0) || 0;
  if (error) {
    return (
      <div className="space-y-6 p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar planos</h3>
            <p className="text-gray-600">Não foi possível carregar a lista de planos. Tente novamente.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Gerenciamento de Planos</h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Crie e gerencie planos de assinatura para sua plataforma</p>
          </div>
          <div className="w-full sm:w-auto">
            <CreatePlanModal />
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="relative max-w-md w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Pesquisar planos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
              {isFiltering && searchTerm && (
                <Loader2 className="h-4 w-4 text-gray-400 animate-spin mr-2" />
              )}
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          {debouncedSearchTerm && (
            <div className="text-sm text-gray-600">
              {totalPlans === 1 
                ? `1 plano encontrado` 
                : `${totalPlans} planos encontrados`
              }
            </div>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="flex flex-col h-full">
              <CardHeader className="pb-4">
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-0">
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="space-y-2">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="h-3 w-full" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500">
            {debouncedSearchTerm ? (
              <>
                <p className="text-lg font-medium mb-2">Nenhum plano encontrado</p>
                <p className="text-sm">Nenhum plano corresponde à sua pesquisa "{debouncedSearchTerm}".</p>
              </>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">Nenhum plano encontrado</p>
                <p className="text-sm mb-4">Clique em "Criar Plano" para criar o primeiro plano.</p>
                <CreatePlanModal />
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredPlans.map((plan) => (
            <PlanDetailsModal
              key={plan.id}
              planId={plan.id!}
              trigger={
                <Card className="relative flex flex-col h-full cursor-pointer hover:shadow-lg transition-shadow" style={{ borderColor: plan.mainColor }}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg sm:text-xl truncate">{plan.name}</CardTitle>
                        <div className="mt-2">
                          <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1">
                            <span className="text-2xl sm:text-3xl font-bold">{formatPrice(plan.suggestedPrice)}</span>
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
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <EditPlanModal 
                              plan={plan}
                              trigger={
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar Plano
                                </DropdownMenuItem>
                              }
                            />
                            <DeletePlanDialog 
                              plan={plan}
                              trigger={
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Excluir Plano
                                </DropdownMenuItem>
                              }
                            />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div className="text-xs sm:text-sm text-gray-600">
                        <p className="line-clamp-2">{plan.description}</p>
                      </div>
                      
                      {plan.serviceIds && plan.serviceIds.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs sm:text-sm font-medium">Serviços Incluídos:</p>
                          <div className="flex items-center text-xs sm:text-sm text-gray-600 gap-2">
                            <Check className="h-3 w-3 shrink-0" style={{ color: '#95CA3C' }} />
                            <span>{plan.serviceIds.length} serviços disponíveis</span>
                          </div>
                          {plan.freeServices && plan.freeServices.length > 0 && (
                            <div className="flex items-center text-xs sm:text-sm text-green-600 gap-2">
                              <Check className="h-3 w-3 shrink-0" />
                              <span>{plan.freeServices.length} gratuitos</span>
                            </div>
                          )}
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
              }
            />
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-2" />
              ) : (
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">{totalPlans}</div>
              )}
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Total de Planos</p>
              {!isLoading && (
                <p className="text-xs text-green-600 mt-1">
                  {activePlans} ativos
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-2" />
              ) : (
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{totalServices}</div>
              )}
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Total de Serviços</p>
              {!isLoading && (
                <p className="text-xs text-green-600 mt-1">
                  Distribuídos nos planos
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-2" />
              ) : (
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">{totalFreeServices}</div>
              )}
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Serviços Permitidos</p>
              {!isLoading && (
                <p className="text-xs text-green-600 mt-1">
                  Nos planos ativos
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="h-6 sm:h-8 w-12 sm:w-16 mb-2" />
              ) : (
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600">
                  {filteredPlans.filter(p => p.specialRules?.microchipFree).length}
                </div>
              )}
              <p className="text-xs sm:text-sm text-gray-600 mt-1">Com Microchip Grátis</p>
              {!isLoading && (
                <p className="text-xs text-green-600 mt-1">
                  Benefício especial
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}