import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
} from '@/components/ui/dropdown-menu';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Search, Loader2, PawPrint, ChevronDown, ChevronRight, Calendar, Heart, Scissors, Weight, Users as UsersIcon, Star, Crown } from 'lucide-react';
import { getUsers } from '@/services/get-users';
import { UserPet } from '@/types/users';  
import { colors } from '@/theme/colors';

export function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  // Garantir que users é sempre um array
  const safeUsers = users || [];

  const filteredUsers = safeUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ).map(user => ({
    ...user,
    pets: user.pets || []
  }));

  const toggleUserExpansion = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const PetDetails = ({ pet }: { pet: UserPet }) => (
    <div className="border rounded-lg p-5 mb-4" style={{ 
      backgroundColor: colors.background,
      borderColor: colors.gray_ultra_light 
    }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.green }}>
          <PawPrint className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-lg" style={{ color: colors.black }}>{pet.nome}</h4>
          <Badge variant="outline" style={{ 
            borderColor: colors.purple, 
            color: colors.purple 
          }}>
            {pet.tipo_animal}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-md" style={{ backgroundColor: colors.background }}>
          <p className="text-xs font-medium mb-1" style={{ color: colors.gray_light }}>SEXO</p>
          <p className="font-medium" style={{ color: colors.black }}>{pet.sexo}</p>
        </div>
        <div className="p-3 rounded-md" style={{ backgroundColor: colors.background }}>
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3" style={{ color: colors.gray_light }} />
            <p className="text-xs font-medium" style={{ color: colors.gray_light }}>IDADE</p>
          </div>
          <p className="font-medium" style={{ color: colors.black }}>{pet.idade} anos</p>
        </div>
        <div className="p-3 rounded-md" style={{ backgroundColor: colors.background }}>
          <p className="text-xs font-medium mb-1" style={{ color: colors.gray_light }}>RAÇA</p>
          <p className="font-medium" style={{ color: colors.black }}>{pet.raca}</p>
        </div>
        <div className="p-3 rounded-md" style={{ backgroundColor: colors.background }}>
          <p className="text-xs font-medium mb-1" style={{ color: colors.gray_light }}>PELAGEM</p>
          <p className="font-medium" style={{ color: colors.black }}>{pet.pelagem}</p>
        </div>
        <div className="p-3 rounded-md" style={{ backgroundColor: colors.background }}>
          <div className="flex items-center gap-1 mb-1">
            <Weight className="h-3 w-3" style={{ color: colors.gray_light }} />
            <p className="text-xs font-medium" style={{ color: colors.gray_light }}>PESO</p>
          </div>
          <p className="font-medium" style={{ color: colors.black }}>{pet.peso}</p>
        </div>
        <div className="p-3 rounded-md" style={{ backgroundColor: colors.background }}>
          <div className="flex items-center gap-1 mb-1">
            <Scissors className="h-3 w-3" style={{ color: colors.gray_light }} />
            <p className="text-xs font-medium" style={{ color: colors.gray_light }}>CASTRADO</p>
          </div>
          <Badge variant={pet.castrado ? "default" : "secondary"} style={{
            backgroundColor: pet.castrado ? colors.green : colors.gray_light,
            color: 'white',
            border: 'none'
          }}>
            {pet.castrado ? "Sim" : "Não"}
          </Badge>
        </div>
        <div className="p-3 rounded-md sm:col-span-2 lg:col-span-2" style={{ backgroundColor: colors.background }}>
          <p className="text-xs font-medium mb-1" style={{ color: colors.gray_light }}>CADASTRADO EM</p>
          <p className="font-medium" style={{ color: colors.black }}>{formatDate(pet.created_at)}</p>
        </div>
      </div>

      {pet.planAtivo && pet.planAtivo.plan && (
        <div className="border rounded-lg p-4 mb-4" style={{ 
          backgroundColor: '#f0f9ff',
          borderColor: colors.green 
        }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.green }}>
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div>
              <h5 className="font-semibold" style={{ color: colors.black }}>Plano Ativo</h5>
              <p className="text-sm" style={{ color: colors.gray_light }}>Plano atual do pet</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: colors.gray_light }}>NOME DO PLANO</p>
              <p className="font-medium" style={{ color: colors.black }}>
                {pet.planAtivo.plan.name || 'Nome não disponível'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: colors.gray_light }}>STATUS</p>
              <Badge style={{ 
                backgroundColor: pet.planAtivo.plan.mainColor || colors.green,
                color: 'white',
                border: 'none'
              }}>
                {pet.planAtivo.status || 'Status não disponível'}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium mb-1" style={{ color: colors.gray_light }}>PRÓXIMO PAGAMENTO</p>
              <p className="font-medium" style={{ color: colors.black }}>
                {pet.planAtivo.next_payment_date ? formatDate(pet.planAtivo.next_payment_date) : 'Data não disponível'}
              </p>
            </div>
          </div>
        </div>
      )}

      {pet.subscriptions && pet.subscriptions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4" style={{ color: colors.yellow }} />
            <h5 className="font-semibold" style={{ color: colors.black }}>
              Histórico de Planos ({pet.subscriptions.length})
            </h5>
          </div>
          <div className="space-y-2">
            {pet.subscriptions.slice(0, 3).map((subscription) => (
              <div key={subscription.id_subscription} 
                   className="border rounded-md p-3" 
                   style={{ borderColor: colors.gray_ultra_light }}>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: colors.black }}>
                      {subscription.plan?.name || 'Nome não disponível'}
                    </p>
                    <p className="text-sm mt-1" style={{ color: colors.gray_light }}>
                      {subscription.start_date ? formatDate(subscription.start_date) : 'Data não disponível'} - {subscription.due_date ? formatDate(subscription.due_date) : 'Data não disponível'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <Badge style={{
                      backgroundColor: subscription.status === 'active' ? colors.green : colors.gray_light,
                      color: 'white',
                      border: 'none'
                    }}>
                      {subscription.status || 'Status não disponível'}
                    </Badge>
                    <p className="text-xs mt-1" style={{ color: colors.gray_light }}>
                      {subscription.payment_status || 'Status não disponível'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {pet.subscriptions.length > 3 && (
              <div className="text-center py-2">
                <p className="text-sm px-3 py-1 rounded-md inline-block" style={{ 
                  color: colors.gray_light,
                  backgroundColor: colors.background 
                }}>
                  +{pet.subscriptions.length - 3} planos adicionais
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.background }}>
        <Card className="w-full max-w-md" style={{ borderColor: colors.red }}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.red}20` }}>
                <UsersIcon className="h-8 w-8" style={{ color: colors.red }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: colors.red }}>
                Erro ao carregar usuários
              </h3>
              <p className="text-sm" style={{ color: colors.gray_light }}>
                {error instanceof Error ? error.message : 'Erro desconhecido'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Verificar se os dados estão carregados
  if (isLoading || !users) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.background }}>
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.purple}20` }}>
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.purple }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: colors.black }}>
                Carregando usuários...
              </h3>
              <p className="text-sm" style={{ color: colors.gray_light }}>
                Aguarde enquanto buscamos os dados
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6" >
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="flex items-center justify-center gap-2 lg:gap-3 mb-3 lg:mb-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.purple }}>
              <UsersIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: colors.black }}>
              Usuários
            </h1>
          </div>
          <p className="text-base lg:text-lg max-w-2xl mx-auto px-4" style={{ color: colors.gray_light }}>
            Gerencie todos os usuários registrados, seus pets e planos
          </p>
        </div>

        {/* Search */}
        <Card className="max-w-md mx-auto" style={{ backgroundColor: colors.background, borderColor: colors.gray_ultra_light }}>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: colors.gray_light }} />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                style={{ borderColor: colors.gray_ultra_light }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Users List */}
        <Card style={{ backgroundColor: colors.background, borderColor: colors.gray_ultra_light }}>
          <CardHeader style={{ backgroundColor: colors.purple }}>
            <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
              <UsersIcon className="h-5 w-5" />
              Todos os Usuários ({isLoading ? '...' : filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                  <Collapsible
                    key={user.id}
                    open={expandedUsers.has(user.id)}
                    onOpenChange={() => toggleUserExpansion(user.id)}
                  >
                    <div className="border rounded-lg" style={{ borderColor: colors.gray_ultra_light }}>
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-3 lg:p-4 hover:opacity-75 cursor-pointer">
                          <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
                            <Button variant="ghost" size="sm" className="p-0 h-auto bg-transparent flex-shrink-0">
                              {expandedUsers.has(user.id) ? (
                                <ChevronDown className="h-4 w-4" style={{ color: colors.purple }} />
                              ) : (
                                <ChevronRight className="h-4 w-4" style={{ color: colors.gray_light }} />
                              )}
                            </Button>
                            <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: colors.purple }}>
                                <UsersIcon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-semibold text-sm lg:text-base truncate" style={{ color: colors.black }}>{user.name}</p>
                                <p className="text-xs lg:text-sm truncate" style={{ color: colors.gray_light }}>{user.email}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-1 lg:space-x-4 flex-shrink-0">
                            <div className="hidden sm:flex items-center gap-1">
                              {user.status === 'Administrador' && <Crown className="h-3 w-3" style={{ color: colors.yellow }} />}
                              <Badge className="text-xs" style={{
                                backgroundColor: user.status === 'Administrador' ? colors.yellow : colors.green,
                                color: 'white',
                                border: 'none'
                              }}>
                                {user.status}
                              </Badge>
                            </div>
                            
                            <div className="text-center px-2 lg:px-3 py-1 rounded-md min-w-[50px] lg:min-w-[60px]" style={{ backgroundColor: colors.background }}>
                              <p className="font-semibold text-xs lg:text-sm" style={{ color: colors.black }}>{user.totalPets}</p>
                              <p className="text-xs hidden lg:block" style={{ color: colors.gray_light }}>pets</p>
                            </div>
                            
                            <div className="text-center px-2 lg:px-3 py-1 rounded-md min-w-[50px] lg:min-w-[60px]" style={{ backgroundColor: colors.background }}>
                              <p className="font-semibold text-xs lg:text-sm" style={{ color: colors.green }}>{user.activePlans}</p>
                              <p className="text-xs hidden lg:block" style={{ color: colors.gray_light }}>planos</p>
                            </div>
                            
                            <div className="text-center px-2 lg:px-3 py-1 rounded-md min-w-[60px] lg:min-w-[80px] hidden md:block" style={{ backgroundColor: colors.background }}>
                              <p className="text-xs mb-1" style={{ color: colors.gray_light }}>Cadastro</p>
                              <p className="font-medium text-xs" style={{ color: colors.black }}>{formatDate(user.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="px-3 lg:px-4 pb-4 border-t" style={{ 
                          borderColor: colors.gray_ultra_light,
                          backgroundColor: colors.background 
                        }}>
                          <div className="pt-4">
                            {/* Status mobile - apenas visível em mobile */}
                            <div className="sm:hidden mb-4 flex justify-center">
                              <div className="flex items-center gap-1">
                                {user.status === 'Administrador' && <Crown className="h-3 w-3" style={{ color: colors.yellow }} />}
                                <Badge className="text-xs" style={{
                                  backgroundColor: user.status === 'Administrador' ? colors.yellow : colors.green,
                                  color: 'white',
                                  border: 'none'
                                }}>
                                  {user.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                              <PawPrint className="h-4 w-4" style={{ color: colors.purple }} />
                              <h3 className="font-semibold" style={{ color: colors.black }}>
                                Pets de {user.name} ({user.pets.length})
                              </h3>
                            </div>
                            
                            {user.pets.length === 0 ? (
                              <div className="text-center py-8 rounded-lg" style={{ backgroundColor: colors.background }}>
                                <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: colors.background }}>
                                  <PawPrint className="h-8 w-8" style={{ color: colors.gray_light }} />
                                </div>
                                <h4 className="font-medium mb-2" style={{ color: colors.black }}>Nenhum pet cadastrado</h4>
                                <p className="text-sm" style={{ color: colors.gray_light }}>Este usuário ainda não possui pets registrados</p>
                              </div>
                            ) : (
                              <div>
                                {user.pets.map((pet) => (
                                  <PetDetails key={pet.id_pet} pet={pet} />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}