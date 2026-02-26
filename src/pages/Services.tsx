import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle,
  Search,
  X,
  Loader2,
  Filter,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useServices } from "@/hooks/useServices";
import { useDebounce } from "@/hooks/useDebounce";
import { CreateServiceModal } from "@/components/services/CreateServiceModal";
import { EditServiceModal } from "@/components/services/EditServiceModal";
import { DeleteServiceDialog } from "@/components/services/DeleteServiceDialog";
import { ServiceDetailsModal } from "@/components/services/ServiceDetailsModal";
import { ManualServiceRecordModal } from "@/components/services/ManualServiceRecordModal";
import { ServiceType, ServiceCategory } from "@/types/services";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const getCategoryLabel = (category: ServiceCategory) => {
  const labels: Record<ServiceCategory, string> = {
    [ServiceCategory.CLINICAL]: "Clínico",
    [ServiceCategory.AESTHETIC]: "Estético",
    [ServiceCategory.SURGICAL]: "Cirúrgico",
    [ServiceCategory.DIAGNOSTIC]: "Diagnóstico",
    [ServiceCategory.VACCINE]: "Vacina",
    [ServiceCategory.TRANSPORT]: "Transporte",
  };
  return labels[category] || category;
};

const getTypeLabel = (type: ServiceType) => {
  const labels = {
    [ServiceType.CONSULTATION]: "Consulta",
    [ServiceType.VACCINE]: "Vacina",
    [ServiceType.EXAM]: "Exame",
    [ServiceType.PROCEDURE]: "Procedimento",
    [ServiceType.SURGERY]: "Cirurgia",
    [ServiceType.AESTHETIC]: "Estético",
    [ServiceType.HOSPITALIZATION]: "Internação",
    [ServiceType.ANESTHESIA]: "Anestesia",
    [ServiceType.BATH_AND_GROOMING]: "Banho e Tosa",
  };
  return labels[type] || type;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(price);
};

const formatDuration = (duration: number) => {
  if (duration >= 60) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return minutes > 0 ? `${hours}h ${minutes}min` : `${hours}h`;
  }
  return `${duration}min`;
};

export function Services() {
  const { data: services, isLoading, error } = useServices();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    ServiceCategory | "all"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const isFiltering = searchTerm !== debouncedSearchTerm;
  const filteredServices = useMemo(() => {
    if (!services) return [];

    let filtered = services;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (service) => service.category === selectedCategory,
      );
    }

    if (debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (service) =>
          service.name.toLowerCase().includes(term) ||
          service.description.toLowerCase().includes(term) ||
          getTypeLabel(service.type).toLowerCase().includes(term) ||
          getCategoryLabel(service.category).toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [services, debouncedSearchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredServices.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredServices, currentPage, itemsPerPage]);

  const resetPage = () => setCurrentPage(1);

  const totalServices = filteredServices.length;
  const activeServices = filteredServices.filter(
    (service) => service.isActive,
  ).length;
  const categories = filteredServices
    ? new Set(filteredServices.map((service) => service.category)).size
    : 0;

  const availableCategories = useMemo(() => {
    if (!services) return [];
    const categoriesSet = new Set(services.map((service) => service.category));
    return Array.from(categoriesSet).sort();
  }, [services]);

  const handleCategoryChange = (category: ServiceCategory | "all") => {
    setSelectedCategory(category);
    resetPage();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    resetPage();
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
            <h3 className="mb-2 text-lg font-semibold">
              Erro ao carregar serviços
            </h3>
            <p className="text-gray-600">
              Não foi possível carregar a lista de serviços. Tente novamente.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4 sm:space-y-6 sm:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Gerenciamento de Serviços
            </h1>
            <p className="mt-1 text-sm text-gray-600 sm:mt-2 sm:text-base">
              Gerencie seu catálogo de serviços
            </p>
          </div>
          <div className="flex w-full gap-2 sm:w-auto">
            <ManualServiceRecordModal
              trigger={
                <Button variant="outline" className="whitespace-nowrap">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Baixa Manual
                </Button>
              }
            />
            <CreateServiceModal />
          </div>
        </div>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md sm:w-auto">
            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <Input
              placeholder="Pesquisar serviços..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-10"
            />
            <div className="absolute flex items-center transform -translate-y-1/2 right-3 top-1/2">
              {isFiltering && searchTerm && (
                <Loader2 className="w-4 h-4 mr-2 text-gray-400 animate-spin" />
              )}
              {searchTerm && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter className="flex-shrink-0 w-4 h-4 text-gray-400" />
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(debouncedSearchTerm || selectedCategory !== "all") && (
            <div className="text-sm text-gray-600">
              {totalServices === 1
                ? `1 serviço encontrado`
                : `${totalServices} serviços encontrados`}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 sm:gap-4 lg:gap-6">
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="w-12 h-6 mb-2 sm:h-8 sm:w-16" />
              ) : (
                <div className="text-lg font-bold text-blue-600 sm:text-xl lg:text-2xl">
                  {totalServices}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                Total de Serviços
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="transition-shadow hover:shadow-md">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="w-12 h-6 mb-2 sm:h-8 sm:w-16" />
              ) : (
                <div className="text-lg font-bold text-green-600 sm:text-xl lg:text-2xl">
                  {activeServices}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                Serviços Ativos
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-2 transition-shadow lg:col-span-1 hover:shadow-md">
          <CardContent className="p-3 sm:p-4 lg:pt-6">
            <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
              {isLoading ? (
                <Skeleton className="w-12 h-6 mb-2 sm:h-8 sm:w-16" />
              ) : (
                <div className="text-lg font-bold text-purple-600 sm:text-xl lg:text-2xl">
                  {categories}
                </div>
              )}
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">
                Categorias
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            Todos os Serviços
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center p-4 space-x-4 border rounded-lg"
                >
                  <Skeleton className="w-12 h-12 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-[200px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="py-12 text-center">
              <div className="text-gray-500">
                {debouncedSearchTerm || selectedCategory !== "all" ? (
                  <>
                    <p className="mb-2 text-lg font-medium">
                      Nenhum serviço encontrado
                    </p>
                    <p className="text-sm">
                      Nenhum serviço corresponde aos filtros aplicados.
                      {debouncedSearchTerm &&
                        ` Pesquisa: "${debouncedSearchTerm}"`}
                      {selectedCategory !== "all" &&
                        ` Categoria: ${getCategoryLabel(selectedCategory)}`}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-lg font-medium">
                      Nenhum serviço encontrado
                    </p>
                    <p className="text-sm">
                      Clique em "Adicionar Serviço" para criar o primeiro
                      serviço.
                    </p>
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="block space-y-4 md:hidden">
                {paginatedServices.map((service) => (
                  <ServiceDetailsModal
                    key={service.id}
                    serviceId={service.id}
                    trigger={
                      <Card className="transition-shadow border border-gray-200 cursor-pointer hover:shadow-md">
                        <CardContent className="p-3 sm:p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="flex-1 text-sm font-medium sm:text-base line-clamp-2">
                                {service.name}
                              </h3>
                              <Badge
                                variant={
                                  service.isActive ? "default" : "secondary"
                                }
                                style={
                                  service.isActive
                                    ? {
                                        backgroundColor: "#95CA3C",
                                        color: "white",
                                      }
                                    : {}
                                }
                                className="flex-shrink-0 text-xs"
                              >
                                {service.isActive ? "Ativo" : "Inativo"}
                              </Badge>
                            </div>

                            <p className="text-xs text-gray-500 sm:text-sm line-clamp-2">
                              {service.description}
                            </p>

                            <div className="flex flex-wrap gap-1">
                              <Badge variant="outline" className="text-xs">
                                {getTypeLabel(service.type)}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {getCategoryLabel(service.category)}
                              </Badge>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-400">
                                    Duração:
                                  </span>
                                  <span className="text-sm font-medium">
                                    {formatDuration(service.duration)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-400">
                                    Preço:
                                  </span>
                                  <span className="text-sm font-semibold text-green-600">
                                    {formatPrice(service.price)}
                                  </span>
                                </div>
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex-shrink-0 w-8 h-8 p-0"
                                  >
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <EditServiceModal
                                    service={service}
                                    trigger={
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()}
                                      >
                                        {" "}
                                        {/* Adicione isso */}
                                        <Edit className="w-4 h-4 mr-2" />
                                        Editar Serviço
                                      </DropdownMenuItem>
                                    }
                                  />
                                  <DeleteServiceDialog
                                    service={service}
                                    trigger={
                                      <DropdownMenuItem
                                        onSelect={(e) => e.preventDefault()} // Adicione isso
                                        className="text-red-600"
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Excluir Serviço
                                      </DropdownMenuItem>
                                    }
                                  />
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    }
                  />
                ))}
              </div>

              <div className="hidden md:block">
                <div className="-mx-4 overflow-x-auto sm:mx-0">
                  <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                      <Table className="min-w-full divide-y divide-gray-200">
                        <TableHeader className="bg-gray-50">
                          <TableRow>
                            <TableHead className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Nome do Serviço
                            </TableHead>
                            <TableHead className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase lg:table-cell">
                              Tipo
                            </TableHead>
                            <TableHead className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase xl:table-cell">
                              Categoria
                            </TableHead>
                            <TableHead className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase xl:table-cell">
                              Duração
                            </TableHead>
                            <TableHead className="px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Preço
                            </TableHead>
                            <TableHead className="hidden px-3 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase xl:table-cell">
                              Status
                            </TableHead>
                            <TableHead className="px-3 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase">
                              Ações
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {paginatedServices.map((service) => (
                            <TableRow
                              key={service.id}
                              className="hover:bg-gray-50"
                            >
                              <ServiceDetailsModal
                                serviceId={service.id}
                                trigger={
                                  <TableCell className="px-3 py-4 cursor-pointer">
                                    <div className="max-w-xs">
                                      <div className="font-medium text-gray-900 truncate">
                                        {service.name}
                                      </div>
                                      <div className="text-sm text-gray-500 truncate md:line-clamp-1">
                                        {service.description}
                                      </div>
                                      <div className="flex flex-wrap gap-1 mt-1 xl:hidden">
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {getTypeLabel(service.type)}
                                        </Badge>
                                        <Badge
                                          variant="outline"
                                          className="text-xs xl:hidden"
                                        >
                                          {getCategoryLabel(service.category)}
                                        </Badge>
                                      </div>
                                    </div>
                                  </TableCell>
                                }
                              />
                              <ServiceDetailsModal
                                serviceId={service.id}
                                trigger={
                                  <TableCell className="hidden px-3 py-4 cursor-pointer lg:table-cell">
                                    <Badge
                                      variant="outline"
                                      className="text-sm"
                                    >
                                      {getTypeLabel(service.type)}
                                    </Badge>
                                  </TableCell>
                                }
                              />
                              <ServiceDetailsModal
                                serviceId={service.id}
                                trigger={
                                  <TableCell className="hidden px-3 py-4 cursor-pointer xl:table-cell">
                                    <Badge
                                      variant="outline"
                                      className="text-sm"
                                    >
                                      {getCategoryLabel(service.category)}
                                    </Badge>
                                  </TableCell>
                                }
                              />
                              <ServiceDetailsModal
                                serviceId={service.id}
                                trigger={
                                  <TableCell className="hidden px-3 py-4 text-gray-600 cursor-pointer xl:table-cell">
                                    <span className="text-sm font-medium">
                                      {formatDuration(service.duration)}
                                    </span>
                                  </TableCell>
                                }
                              />
                              <ServiceDetailsModal
                                serviceId={service.id}
                                trigger={
                                  <TableCell className="px-3 py-4 cursor-pointer">
                                    <div className="text-sm font-semibold text-gray-900">
                                      {formatPrice(service.price)}
                                    </div>
                                  </TableCell>
                                }
                              />
                              <ServiceDetailsModal
                                serviceId={service.id}
                                trigger={
                                  <TableCell className="hidden px-3 py-4 cursor-pointer xl:table-cell">
                                    <Badge
                                      variant={
                                        service.isActive
                                          ? "default"
                                          : "secondary"
                                      }
                                      style={
                                        service.isActive
                                          ? {
                                              backgroundColor: "#95CA3C",
                                              color: "white",
                                            }
                                          : {}
                                      }
                                      className="text-xs"
                                    >
                                      {service.isActive ? "Ativo" : "Inativo"}
                                    </Badge>
                                  </TableCell>
                                }
                              />
                              <TableCell className="px-3 py-4 text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="w-8 h-8 p-0"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <EditServiceModal
                                      service={service}
                                      trigger={
                                        <DropdownMenuItem
                                          onSelect={(e) => e.preventDefault()}
                                        >
                                          {" "}
                                          {/* Adicione isso */}
                                          <Edit className="w-4 h-4 mr-2" />
                                          Editar Serviço
                                        </DropdownMenuItem>
                                      }
                                    />
                                    <DeleteServiceDialog
                                      service={service}
                                      trigger={
                                        <DropdownMenuItem
                                          onSelect={(e) => e.preventDefault()} // Adicione isso
                                          className="text-red-600"
                                        >
                                          <Trash2 className="w-4 h-4 mr-2" />
                                          Excluir Serviço
                                        </DropdownMenuItem>
                                      }
                                    />
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {filteredServices.length > 0 && totalPages > 1 && (
            <div className="flex flex-col items-center justify-between gap-4 pt-4 border-t sm:flex-row">
              <div className="order-2 text-sm text-gray-600 sm:order-1">
                Mostrando {(currentPage - 1) * itemsPerPage + 1} a{" "}
                {Math.min(currentPage * itemsPerPage, totalServices)} de{" "}
                {totalServices} serviços
              </div>

              <div className="flex items-center order-1 gap-2 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Anterior</span>
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNumber}
                        variant={
                          currentPage === pageNumber ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className="w-8 h-8 p-0 text-sm"
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  <span className="hidden sm:inline">Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
