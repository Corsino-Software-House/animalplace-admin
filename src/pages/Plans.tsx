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
import { MoreHorizontal, Edit, Trash2, Check, Loader2, Search, X, AlertCircle, Settings } from 'lucide-react';
import { useState, useMemo } from 'react';
import { usePlans } from '@/hooks/usePlans';
import { useDebounce } from '@/hooks/useDebounce';
import { CreatePlanModal } from '@/components/plans/CreatePlanModal';
import { EditPlanModal } from '@/components/plans/EditPlanModal';
import { DeletePlanDialog } from '@/components/plans/DeletePlanDialog';
import { PlanDetailsModal } from '@/components/plans/PlanDetailsModal';
import { ManagePlanServicesModal } from '@/components/plans/ManagePlanServicesModal';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
};

export function Plans() {
  const { data: plans = [], isLoading, error } = usePlans();
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  const isFiltering = searchTerm !== debouncedSearchTerm;
  const filteredPlans = useMemo(() => {
    if (!plans || !debouncedSearchTerm.trim()) return plans;

    const term = debouncedSearchTerm.toLowerCase().trim();
    return plans.filter(plan => 
      (plan.name || '').toLowerCase().includes(term) ||
      (plan.description || '').toLowerCase().includes(term) ||
      (plan.suggestedPrice ? formatPrice(plan.suggestedPrice).toLowerCase() : '').includes(term)
    );
  }, [plans, debouncedSearchTerm]);

  const totalPlans = filteredPlans?.length || 0;
  const activePlans = filteredPlans?.filter(plan => plan.isActive ?? true).length || 0;
  const totalServices = filteredPlans?.reduce((acc, plan) => acc + (plan.serviceIds?.length || 0), 0) || 0;
  const totalFreeServices = filteredPlans?.reduce((acc, plan) => acc + (plan.freeServices?.length || 0), 0) || 0;
  
  if (error) {
    return (
      <div className="p-4 space-y-6 sm:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold">Erro ao carregar planos</h3>
            <p className="text-gray-600">Não foi possível carregar a lista de planos. Tente novamente.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Gerenciamento de Planos</h1>
          <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">Crie e gerencie planos de assinatura para sua plataforma</p>
        </div>
        <div className="w-full sm:w-auto">
          <CreatePlanModal />
        </div>
      </div>
      
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-md sm:w-auto">
          <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
          <Input
            placeholder="Pesquisar planos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10"
          />
          <div className="absolute flex items-center transform -translate-y-1/2 right-3 top-1/2">
            {isFiltering && searchTerm && (
              <Loader2 className="w-4 h-4 mr-2 text-gray-400 animate-spin" />
            )}
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="w-4 h-4" />
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

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="flex flex-col h-full">
              <CardHeader className="pb-4">
                <div className="space-y-3">
                  <Skeleton className="w-3/4 h-6" />
                  <Skeleton className="w-1/2 h-8" />
                </div>
              </CardHeader>
              <CardContent className="flex-1 pt-0">
                <div className="space-y-3">
                  <Skeleton className="w-full h-4" />
                  <Skeleton className="w-2/3 h-4" />
                  <div className="space-y-2">
                    {[...Array(3)].map((_, j) => (
                      <Skeleton key={j} className="w-full h-3" />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className="py-12 text-center">
          <div className="text-gray-500">
            {debouncedSearchTerm ? (
              <>
                <p className="mb-2 text-lg font-medium">Nenhum plano encontrado</p>
                <p className="text-sm">Nenhum plano corresponde à sua pesquisa "{debouncedSearchTerm}".</p>
              </>
            ) : (
              <>
                <p className="mb-2 text-lg font-medium">Nenhum plano encontrado</p>
                <p className="mb-4 text-sm">Clique em "Criar Plano" para criar o primeiro plano.</p>
                <CreatePlanModal />
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-6">
          {filteredPlans.map((plan) => (
            plan.id && (
              <Card 
                key={plan.id}
                className="relative flex flex-col h-full transition-shadow hover:shadow-lg" 
                style={plan.mainColor ? { borderColor: plan.mainColor } : {}}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <PlanDetailsModal
                      planId={plan.id}
                      trigger={
                        <div className="flex-1 min-w-0 cursor-pointer">
                          <CardTitle className="text-lg truncate sm:text-xl">{plan.name || 'Sem Nome'}</CardTitle>
                          <div className="mt-2">
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-1">
                              <span className="text-2xl font-bold sm:text-3xl">{plan.suggestedPrice ? formatPrice(plan.suggestedPrice) : 'N/A'}</span>
                              <span className="text-sm text-gray-500">/{plan.duration || 'N/A'} dias</span>
                            </div>
                          </div>
                        </div>
                      }
                    />
                    
                    <div className="flex flex-col items-end space-y-2 shrink-0">
                      <Badge 
                        variant={(plan.isActive ?? true) ? 'default' : 'secondary'}
                        style={(plan.isActive ?? true) ? { backgroundColor: '#95CA3C', color: 'white' } : {}}
                        className="text-xs"
                      >
                        {(plan.isActive ?? true) ? 'Ativo' : 'Inativo'}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            className="w-8 h-8 p-0 bg-transparent"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <EditPlanModal 
                            plan={plan}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="w-4 h-4 mr-2" />
                                Editar Plano
                              </DropdownMenuItem>
                            }
                          />
                          
                          <ManagePlanServicesModal
                            plan={plan}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Settings className="w-4 h-4 mr-2" />
                                Gerenciar Serviços
                              </DropdownMenuItem>
                            }
                          />
                          
                          <DeletePlanDialog 
                            plan={plan}
                            trigger={
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Trash2 className="w-4 h-4 mr-2 text-red-600" />
                                <span className="text-red-600">Excluir Plano</span>
                              </DropdownMenuItem>
                            }
                          />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                
                <PlanDetailsModal
                  planId={plan.id}
                  trigger={
                    <CardContent className="flex-1 pt-0 cursor-pointer">
                      <div className="space-y-3 sm:space-y-4">
                        <div className="text-xs text-gray-600 sm:text-sm">
                          <p className="line-clamp-2">{plan.description || 'Sem descrição'}</p>
                        </div>
                        
                        {(plan.serviceIds && plan.serviceIds.length > 0) && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium sm:text-sm">Serviços Incluídos:</p>
                            <div className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
                              <Check className="w-3 h-3 shrink-0" style={{ color: '#95CA3C' }} />
                              <span>{plan.serviceIds.length} serviços disponíveis</span>
                            </div>
                            {(plan.freeServices && plan.freeServices.length > 0) && (
                              <div className="flex items-center gap-2 text-xs text-green-600 sm:text-sm">
                                <Check className="w-3 h-3 shrink-0" />
                                <span>{plan.freeServices.length} gratuitos</span>
                              </div>
                            )}
                          </div>
                        )}

                        {(plan.specialRules && plan.specialRules.microchipFree) && (
                          <div className="flex items-center gap-2 text-xs sm:text-sm" style={plan.mainColor ? { color: plan.mainColor } : {}}>
                            <Check className="w-3 h-3 shrink-0" />
                            <span>Microchip gratuito</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  }
                />
              </Card>
            )
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 sm:gap-4 lg:gap-6">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="w-12 h-6 mb-2 sm:h-8 sm:w-16" />
              ) : (
                <div className="text-lg font-bold text-blue-600 sm:text-xl lg:text-2xl">{totalPlans}</div>
              )}
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">Total de Planos</p>
              {!isLoading && (
                <p className="mt-1 text-xs text-green-600">
                  {activePlans} ativos
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="w-12 h-6 mb-2 sm:h-8 sm:w-16" />
              ) : (
                <div className="text-lg font-bold text-green-600 sm:text-xl lg:text-2xl">{totalServices}</div>
              )}
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">Total de Serviços</p>
              {!isLoading && (
                <p className="mt-1 text-xs text-green-600">
                  Distribuídos nos planos
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="w-12 h-6 mb-2 sm:h-8 sm:w-16" />
              ) : (
                <div className="text-lg font-bold text-purple-600 sm:text-xl lg:text-2xl">{totalFreeServices}</div>
              )}
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">Serviços Permitidos</p>
              {!isLoading && (
                <p className="mt-1 text-xs text-green-600">
                  Nos planos ativos
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 transition-shadow lg:col-span-1 hover:shadow-md">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="w-12 h-6 mb-2 sm:h-8 sm:w-16" />
              ) : (
                <div className="text-lg font-bold text-orange-600 sm:text-xl lg:text-2xl">
                  {filteredPlans.filter(p => p.specialRules && p.specialRules.microchipFree).length}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">Com Microchip Grátis</p>
              {!isLoading && (
                <p className="mt-1 text-xs text-green-600">
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