import { useState, useMemo } from 'react';
import { format, isToday, isTomorrow, isThisWeek, isThisMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Calendar, 
  Clock, 
  User, 
  MapPin, 
  // Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useSchedule } from '@/hooks/useSchedule';
import { RescheduleModal } from '@/components/agenda/RescheduleModal';
import { DeleteScheduleDialog } from '@/components/agenda/DeleteScheduleDialog';
import { ScheduleDetailsModal } from '@/components/agenda/ScheduleDetailsModal';
import { Scheduling } from '@/types/schedule';



export function Agenda() {
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSchedule, setSelectedSchedule] = useState<Scheduling | null>(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  
  const { schedules, loading, error, fetchSchedules, reschedule, deleteSchedule } = useSchedule();

  // Filtrar agendamentos
  const filteredSchedules = useMemo(() => {
    let filtered = schedules;

    // Filtro por data
    if (dateFilter !== 'all') {
      filtered = filtered.filter((schedule) => {
        const scheduleDate = new Date(schedule.data_hora);
        switch (dateFilter) {
          case 'today':
            return isToday(scheduleDate);
          case 'tomorrow':
            return isTomorrow(scheduleDate);
          case 'week':
            return isThisWeek(scheduleDate);
          case 'month':
            return isThisMonth(scheduleDate);
          default:
            return true;
        }
      });
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((schedule) => 
        schedule.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    return filtered;
  }, [schedules, dateFilter, statusFilter]);

  // Estatísticas calculadas
  const stats = useMemo(() => {
    const todaySchedules = schedules.filter(s => isToday(new Date(s.data_hora)));
    
    return {
      todayTotal: todaySchedules.length,
      inProgress: schedules.filter(s => s.status.toLowerCase().includes('progress') || s.status.toLowerCase().includes('andamento')).length,
      pending: schedules.filter(s => s.status.toLowerCase().includes('pending') || s.status.toLowerCase().includes('pendente')).length,
      locations: new Set(schedules.map(s => s.user.endereco_completo)).size,
    };
  }, [schedules]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
      case 'em-andamento':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'concluído':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewDetails = (schedule: Scheduling) => {
    setSelectedSchedule(schedule);
    setDetailsModalOpen(true);
  };

  const handleReschedule = (schedule: Scheduling) => {
    setSelectedSchedule(schedule);
    setRescheduleModalOpen(true);
  };

  const handleDelete = (schedule: Scheduling) => {
    setSelectedSchedule(schedule);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Agenda & Calendário</h1>
          <p className="text-gray-600 mt-2">Gerencie todos os agendamentos e serviços</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={fetchSchedules}
            disabled={loading}
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          {/* <Button style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button> */}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Estatísticas do Dia */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <div>
                {loading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <div className="text-2xl font-bold">{stats.todayTotal}</div>
                )}
                <p className="text-sm text-gray-600">Agendamentos Hoje</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <div>
                {loading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <div className="text-2xl font-bold">{stats.inProgress}</div>
                )}
                <p className="text-sm text-gray-600">Em Andamento</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <div>
                {loading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <div className="text-2xl font-bold">{stats.pending}</div>
                )}
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <div>
                {loading ? (
                  <Skeleton className="h-8 w-12" />
                ) : (
                  <div className="text-2xl font-bold">{stats.locations}</div>
                )}
                <p className="text-sm text-gray-600">Localizações Ativas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por data" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Datas</SelectItem>
                <SelectItem value="today">Hoje</SelectItem>
                <SelectItem value="tomorrow">Amanhã</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
                <SelectItem value="month">Este Mês</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="in-progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex-1 text-sm text-gray-600 flex items-center">
              Mostrando {filteredSchedules.length} de {schedules.length} agendamentos
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Agendamentos */}
      <Card>
        <CardHeader>
          <CardTitle>
            {dateFilter === 'today' ? 'Agenda de Hoje' : 
             dateFilter === 'tomorrow' ? 'Agenda de Amanhã' :
             dateFilter === 'week' ? 'Agenda da Semana' :
             dateFilter === 'month' ? 'Agenda do Mês' : 'Todos os Agendamentos'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum agendamento encontrado para os filtros selecionados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Pet</TableHead>
                    <TableHead className="hidden md:table-cell">Serviços</TableHead>
                    <TableHead className="hidden lg:table-cell">Observações</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchedules.map((schedule) => {
                    const scheduleDate = new Date(schedule.data_hora);
                    return (
                      <TableRow key={schedule.id} className="hover:bg-gray-50">
                        <TableCell className="font-mono text-sm">
                          <div>
                            <div>{format(scheduleDate, 'dd/MM/yyyy', { locale: ptBR })}</div>
                            <div className="text-gray-500">{format(scheduleDate, 'HH:mm', { locale: ptBR })}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{schedule.user.name}</div>
                            <div className="text-sm text-gray-500">{schedule.user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{schedule.pet.nome}</div>
                            <div className="text-sm text-gray-500">{schedule.pet.tipo_animal} - {schedule.pet.raca}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-sm">
                            {schedule.services.slice(0, 2).map(service => service.name).join(', ')}
                            {schedule.services.length > 2 && (
                              <span className="text-gray-500"> +{schedule.services.length - 2} mais</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell max-w-xs">
                          <div className="text-sm text-gray-600 truncate">
                            {schedule.observacoes || 'Sem observações'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(schedule.status)}>
                            {schedule.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewDetails(schedule)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReschedule(schedule)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Reagendar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDelete(schedule)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancelar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <RescheduleModal
        schedule={selectedSchedule}
        open={rescheduleModalOpen}
        onOpenChange={setRescheduleModalOpen}
        onReschedule={reschedule}
        loading={loading}
      />

      <DeleteScheduleDialog
        schedule={selectedSchedule}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={deleteSchedule}
        loading={loading}
      />

      <ScheduleDetailsModal
        schedule={selectedSchedule}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </div>
  );
}