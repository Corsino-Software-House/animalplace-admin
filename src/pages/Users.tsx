import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
  AlertCircle,
} from "lucide-react";
import { getUsers } from "@/services/get-users";
import { UserPet } from "@/types/users";
import { SendPushModal } from "@/components/users/SendPushModal";

export function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const safeUsers = users || [];

  const filteredUsers = safeUsers
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((user) => ({
      ...user,
      pets: user.pets || [],
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
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const PetDetails = ({ pet }: { pet: UserPet }) => (
    <div className="p-5 mb-4 border rounded-lg bg-gray-50">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
          <PawPrint className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-900">{pet.nome}</h4>
          <Badge
            variant="outline"
            className="text-purple-700 border-purple-500"
          >
            {pet.tipo_animal}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="p-3 bg-white rounded-md">
          <p className="mb-1 text-xs font-medium text-gray-500">SEXO</p>
          <p className="font-medium text-gray-900">{pet.sexo}</p>
        </div>
        <div className="p-3 bg-white rounded-md">
          <div className="flex items-center gap-1 mb-1">
            <Calendar className="w-3 h-3 text-gray-500" />
            <p className="text-xs font-medium text-gray-500">IDADE</p>
          </div>
          <p className="font-medium text-gray-900">{pet.idade} anos</p>
        </div>
        <div className="p-3 bg-white rounded-md">
          <p className="mb-1 text-xs font-medium text-gray-500">RAÇA</p>
          <p className="font-medium text-gray-900">{pet.raca}</p>
        </div>
        <div className="p-3 bg-white rounded-md">
          <p className="mb-1 text-xs font-medium text-gray-500">PELAGEM</p>
          <p className="font-medium text-gray-900">{pet.pelagem}</p>
        </div>
        <div className="p-3 bg-white rounded-md">
          <div className="flex items-center gap-1 mb-1">
            <Weight className="w-3 h-3 text-gray-500" />
            <p className="text-xs font-medium text-gray-500">PESO</p>
          </div>
          <p className="font-medium text-gray-900">{pet.peso}</p>
        </div>
        <div className="p-3 bg-white rounded-md">
          <div className="flex items-center gap-1 mb-1">
            <Scissors className="w-3 h-3 text-gray-500" />
            <p className="text-xs font-medium text-gray-500">CASTRADO</p>
          </div>
          <Badge
            className={
              pet.castrado
                ? "bg-green-500 text-white"
                : "bg-gray-400 text-white"
            }
          >
            {pet.castrado ? "Sim" : "Não"}
          </Badge>
        </div>
        <div className="p-3 bg-white rounded-md sm:col-span-2 lg:col-span-2">
          <p className="mb-1 text-xs font-medium text-gray-500">
            CADASTRADO EM
          </p>
          <p className="font-medium text-gray-900">
            {formatDate(pet.created_at)}
          </p>
        </div>
      </div>

      {pet.planAtivo && pet.planAtivo.plan && (
        <div className="p-4 mb-4 border border-green-500 rounded-lg bg-blue-50">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center justify-center w-8 h-8 bg-green-500 rounded-full">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <div>
              <h5 className="font-semibold text-gray-900">Plano Ativo</h5>
              <p className="text-sm text-gray-600">Plano atual do pet</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">
                NOME DO PLANO
              </p>
              <p className="font-medium text-gray-900">
                {pet.planAtivo.plan.name || "Nome não disponível"}
              </p>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">STATUS</p>
              <Badge
                className="text-white border-0"
                style={{
                  backgroundColor: pet.planAtivo.plan.mainColor || "#22c55e",
                }}
              >
                {pet.planAtivo.status || "Status não disponível"}
              </Badge>
            </div>
            <div>
              <p className="mb-1 text-xs font-medium text-gray-500">
                PRÓXIMO PAGAMENTO
              </p>
              <p className="font-medium text-gray-900">
                {pet.planAtivo.next_payment_date
                  ? formatDate(pet.planAtivo.next_payment_date)
                  : "Data não disponível"}
              </p>
            </div>
          </div>
        </div>
      )}

      {pet.subscriptions && pet.subscriptions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-500" />
            <h5 className="font-semibold text-gray-900">
              Histórico de Planos ({pet.subscriptions.length})
            </h5>
          </div>
          <div className="space-y-2">
            {pet.subscriptions.slice(0, 3).map((subscription) => (
              <div
                key={subscription.id_subscription}
                className="p-3 border border-gray-200 rounded-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {subscription.plan?.name || "Nome não disponível"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {subscription.start_date
                        ? formatDate(subscription.start_date)
                        : "Data não disponível"}{" "}
                      -{" "}
                      {subscription.due_date
                        ? formatDate(subscription.due_date)
                        : "Data não disponível"}
                    </p>
                  </div>
                  <div className="ml-4 text-right">
                    <Badge
                      className={`${
                        subscription.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                      } text-white border-0`}
                    >
                      {subscription.status || "Status não disponível"}
                    </Badge>
                    <p className="mt-1 text-xs text-gray-500">
                      {subscription.payment_status || "Status não disponível"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {pet.subscriptions.length > 3 && (
              <div className="py-2 text-center">
                <p className="inline-block px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-md">
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
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="mt-2 text-gray-600">
              Gerencie todos os usuários registrados
            </p>
          </div>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <p>
                {error instanceof Error
                  ? error.message
                  : "Erro ao carregar usuários"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Usuários</h1>
            <p className="mt-2 text-gray-600">
              Gerencie todos os usuários registrados
            </p>
          </div>
          <Button variant="outline" disabled>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Carregando...
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[150px]" />
                  </div>
                  <Skeleton className="w-16 h-6" />
                  <Skeleton className="w-16 h-6" />
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
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="mt-2 text-gray-600">
            Gerencie todos os usuários registrados, seus pets e planos
          </p>
        </div>
        <div className="flex gap-2">
          <SendPushModal
            trigger={
              <Button variant="outline" size="sm">
                📢 Enviar Push
              </Button>
            }
          />

          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Atualizar
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="relative max-w-md">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input
              placeholder="Buscar usuários por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UsersIcon className="w-5 h-5" />
            Lista de Usuários ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="py-8 text-center">
              <UsersIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
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
                  <div className="border border-gray-200 rounded-lg">
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between p-3 cursor-pointer lg:p-4 hover:bg-gray-50">
                        <div className="flex items-center flex-1 min-w-0 space-x-2 lg:space-x-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex-shrink-0 h-auto p-0 bg-transparent"
                          >
                            {expandedUsers.has(user.id) ? (
                              <ChevronDown className="w-4 h-4 text-purple-600" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-400" />
                            )}
                          </Button>
                          <div className="flex items-center flex-1 min-w-0 gap-2 lg:gap-3">
                            <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full lg:w-10 lg:h-10">
                              <UsersIcon className="w-4 h-4 text-white lg:h-5 lg:w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 truncate lg:text-base">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-600 truncate lg:text-sm">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center flex-shrink-0 space-x-1 lg:space-x-4">
                          <div className="items-center hidden gap-1 sm:flex">
                            {user.status === "Administrador" && (
                              <Crown className="w-3 h-3 text-yellow-500" />
                            )}
                            <Badge
                              className={`text-xs ${
                                user.status === "Administrador"
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              } text-white`}
                            >
                              {user.status}
                            </Badge>
                          </div>

                          <div className="text-center px-2 lg:px-3 py-1 rounded-md min-w-[50px] lg:min-w-[60px] bg-gray-100">
                            <p className="text-xs font-semibold text-gray-900 lg:text-sm">
                              {user.totalPets}
                            </p>
                            <p className="hidden text-xs text-gray-600 lg:block">
                              pets
                            </p>
                          </div>

                          <div className="text-center px-2 lg:px-3 py-1 rounded-md min-w-[50px] lg:min-w-[60px] bg-gray-100">
                            <p className="text-xs font-semibold text-green-600 lg:text-sm">
                              {user.activePlans}
                            </p>
                            <p className="hidden text-xs text-gray-600 lg:block">
                              planos
                            </p>
                          </div>

                          <div className="text-center px-2 lg:px-3 py-1 rounded-md min-w-[60px] lg:min-w-[80px] hidden md:block bg-gray-100">
                            <p className="mb-1 text-xs text-gray-600">
                              Cadastro
                            </p>
                            <p className="text-xs font-medium text-gray-900">
                              {formatDate(user.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-3 pb-4 border-t border-gray-200 lg:px-4 bg-gray-50">
                        <div className="pt-4">
                          <div className="flex justify-center mb-4 sm:hidden">
                            <div className="flex items-center gap-1">
                              {user.status === "Administrador" && (
                                <Crown className="w-3 h-3 text-yellow-500" />
                              )}
                              <Badge
                                className={`text-xs ${
                                  user.status === "Administrador"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                } text-white`}
                              >
                                {user.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <PawPrint className="w-4 h-4 text-purple-600" />
                            <h3 className="font-semibold text-gray-900">
                              Pets de {user.name} ({user.pets.length})
                            </h3>
                          </div>

                          {user.pets.length === 0 ? (
                            <div className="py-8 text-center bg-white rounded-lg">
                              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
                                <PawPrint className="w-8 h-8 text-gray-400" />
                              </div>
                              <h4 className="mb-2 font-medium text-gray-900">
                                Nenhum pet cadastrado
                              </h4>
                              <p className="text-sm text-gray-600">
                                Este usuário ainda não possui pets registrados
                              </p>
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
