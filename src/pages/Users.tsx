import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { 
  Search, 
  Loader2, 
  PawPrint, 
  ChevronDown, 
  ChevronRight, 
  Calendar, 
  Heart, 
  Scissors, 
  Weight, 
  Users as UsersIcon, 
  Star, 
  Crown,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { getUsers } from '@/services/get-users';
import { UserPet } from '@/types/users';

export function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const { data: users, isLoading, error, refetch } = useQuery({
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
    <div className="border rounded-lg p-5 mb-4 bg-gray-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-500">
          <PawPrint className="h-5 w-5 text-white" />
        </div>
        <div>
          <h4 className="font-semibold text-lg text-gray-900">{pet.nome}</h4>
          <Badge variant="outline" className="border-purple-500 text-purple-700">
            {pet.tipo_animal}
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="p-3 rounded-md bg-white">
          <p className="text-xs font-medium mb-1 text-gray-500">SEXO</p>
          <p className="font-medium text-gray-900">{pet.sexo}</p>
        </div>
        <div className="p-3 rounded-md bg-white">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="h-3 w-3 text-gray-500" />
            <p className="text-xs font-medium text-gray-500">IDADE</p>
          </div>
          <p className="font-medium text-gray-900">{pet.idade} anos</p>
        </div>
        <div className="p-3 rounded-md bg-white">
          <p className="text-xs font-medium mb-1 text-gray-500">RAÇA</p>
          <p className="font-medium text-gray-900">{pet.raca}</p>
        </div>
        <div className="p-3 rounded-md bg-white">
          <p className="text-xs font-medium mb-1 text-gray-500">PELAGEM</p>
          <p className="font-medium text-gray-900">{pet.pelagem}</p>
        </div>
        <div className="p-3 rounded-md bg-white">
          <div className="flex items-center gap-1 mb-1">
            <Weight className="h-3 w-3 text-gray-500" />
            <p className="text-xs font-medium text-gray-500">PESO</p>
          </div>
          <p className="font-medium text-gray-900">{pet.peso}</p>
        </div>
        <div className="p-3 rounded-md bg-white">
          <div className="flex items-center gap-1 mb-1">
            <Scissors className="h-3 w-3 text-gray-500" />
            <p className="text-xs font-medium text-gray-500">CASTRADO</p>
          </div>
          <Badge className={pet.castrado ? "bg-green-500 text-white" : "bg-gray-400 text-white"}>
            {pet.castrado ? "Sim" : "Não"}
          </Badge>
        </div>
        <div className="p-3 rounded-md bg-white sm:col-span-2 lg:col-span-2">
          <p className="text-xs font-medium mb-1 text-gray-500">CADASTRADO EM</p>
          <p className="font-medium text-gray-900">{formatDate(pet.created_at)}</p>
        </div>
      </div>

      {pet.planAtivo && pet.planAtivo.plan && (
        <div className="border rounded-lg p-4 mb-4 bg-blue-50 border-green-500">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-500">
              <Heart className="h-4 w-4 text-white" />
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">Plano Ativo</h5>
              <p className="text-sm text-gray-600">Plano atual do pet</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <p className="text-xs font-medium mb-1 text-gray-500">NOME DO PLANO</p>
              <p className="font-medium text-gray-900">
                {pet.planAtivo.plan.name || 'Nome não disponível'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium mb-1 text-gray-500">STATUS</p>
              <Badge 
                className="text-white border-0"
                style={{ backgroundColor: pet.planAtivo.plan.mainColor || '#22c55e' }}
              >
                {pet.planAtivo.status || 'Status não disponível'}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-medium mb-1 text-gray-500">PRÓXIMO PAGAMENTO</p>
              <p className="font-medium text-gray-900">
                {pet.planAtivo.next_payment_date ? formatDate(pet.planAtivo.next_payment_date) : 'Data não disponível'}
              </p>
            </div>
          </div>
        </div>
      )}

      {pet.subscriptions && pet.subscriptions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-yellow-500" />
            <h5 className="font-semibold text-gray-900">
              Histórico de Planos ({pet.subscriptions.length})
            </h5>
          </div>
          <div className="space-y-2">
            {pet.subscriptions.slice(0, 3).map((subscription) => (
              <div key={subscription.id_subscription} 
                   className="border rounded-md p-3 border-gray-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {subscription.plan?.name || 'Nome não disponível'}
                    </p>
                    <p className="text-sm mt-1 text-gray-600">
                      {subscription.start_date ? formatDate(subscription.start_date) : 'Data não disponível'} - {subscription.due_date ? formatDate(subscription.due_date) : 'Data não disponível'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <Badge className={`${subscription.status === 'active' ? 'bg-green-500' : 'bg-gray-400'} text-white border-0`}>
                      {subscription.status || 'Status não disponível'}
                    </Badge>
                    <p className="text-xs mt-1 text-gray-500">
                      {subscription.payment_status || 'Status não disponível'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {pet.subscriptions.length > 3 && (
              <div className="text-center py-2">
                <p className="text-sm px-3 py-1 rounded-md inline-block text-gray-600 bg-gray-100">
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
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os usuários registrados</p>
          </div>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p>{error instanceof Error ? error.message : 'Erro ao carregar usuários'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="text-gray-600 mt-2">Gerencie todos os usuários registrados</p>
          </div>
          <Button variant="outline" disabled>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Carregando...
          </Button>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os usuários registrados, seus pets e planos</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar usuários por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="h-5 w-5" />
            Lista de Usuários ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum usuário encontrado.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <Collapsible
                  key={user.id}
                  open={expandedUsers.has(user.id)}
                  onOpenChange={() => toggleUserExpansion(user.id)}
                >
                  <div className="border rounded-lg border-gray-200">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 lg:p-4 hover:bg-gray-50 cursor-pointer">
                        <div className="flex items-center space-x-2 lg:space-x-4 min-w-0 flex-1">
                          <Button variant="ghost" size="sm" className="p-0 h-auto bg-transparent flex-shrink-0">
                            {expandedUsers.has(user.id) ? (
                              <ChevronDown className="h-4 w-4 text-purple-600" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                          <div className="flex items-center gap-2 lg:gap-3 min-w-0 flex-1">
                            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-purple-600">
                              <UsersIcon className="h-4 w-4 lg:h-5 lg:w-5 text-white" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-sm lg:text-base truncate text-gray-900">{user.name}</p>
                              <p className="text-xs lg:text-sm truncate text-gray-600">{user.email}</p>
                            </div>
                          </div>
                        </div>
                          
                        <div className="flex items-center space-x-1 lg:space-x-4 flex-shrink-0">
                          <div className="hidden sm:flex items-center gap-1">
                            {user.status === 'Administrador' && <Crown className="h-3 w-3 text-yellow-500" />}
                            <Badge className={`text-xs ${user.status === 'Administrador' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                              {user.status}
                            </Badge>
                          </div>
                          
                          <div className="text-center px-2 lg:px-3 py-1 rounded-md min-w-[50px] lg:min-w-[60px] bg-gray-100">
                            <p className="font-semibold text-xs lg:text-sm text-gray-900">{user.totalPets}</p>
                            <p className="text-xs hidden lg:block text-gray-600">pets</p>
                          </div>
                          
                          <div className="text-center px-2 lg:px-3 py-1 rounded-md min-w-[50px] lg:min-w-[60px] bg-gray-100">
                            <p className="font-semibold text-xs lg:text-sm text-green-600">{user.activePlans}</p>
                            <p className="text-xs hidden lg:block text-gray-600">planos</p>
                          </div>
                          
                          <div className="text-center px-2 lg:px-3 py-1 rounded-md min-w-[60px] lg:min-w-[80px] hidden md:block bg-gray-100">
                            <p className="text-xs mb-1 text-gray-600">Cadastro</p>
                            <p className="font-medium text-xs text-gray-900">{formatDate(user.createdAt)}</p>
                          </div>
                        </div>
                        </div>
                      </CollapsibleTrigger>
                      
                    <CollapsibleContent>
                      <div className="px-3 lg:px-4 pb-4 border-t border-gray-200 bg-gray-50">
                        <div className="pt-4">
                          {/* Status mobile - apenas visível em mobile */}
                          <div className="sm:hidden mb-4 flex justify-center">
                            <div className="flex items-center gap-1">
                              {user.status === 'Administrador' && <Crown className="h-3 w-3 text-yellow-500" />}
                              <Badge className={`text-xs ${user.status === 'Administrador' ? 'bg-yellow-500' : 'bg-green-500'} text-white`}>
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <PawPrint className="h-4 w-4 text-purple-600" />
                            <h3 className="font-semibold text-gray-900">
                              Pets de {user.name} ({user.pets.length})
                            </h3>
                          </div>
                          
                          {user.pets.length === 0 ? (
                            <div className="text-center py-8 rounded-lg bg-white">
                              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center bg-gray-100">
                                <PawPrint className="h-8 w-8 text-gray-400" />
                              </div>
                              <h4 className="font-medium mb-2 text-gray-900">Nenhum pet cadastrado</h4>
                              <p className="text-sm text-gray-600">Este usuário ainda não possui pets registrados</p>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}