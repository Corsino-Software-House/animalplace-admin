import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Scheduling } from '@/types/schedule';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar,
  Clock,
  User,
  Heart,
  FileText,
  DollarSign,
} from 'lucide-react';

interface ScheduleDetailsModalProps {
  schedule: Scheduling | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ScheduleDetailsModal({
  schedule,
  open,
  onOpenChange,
}: ScheduleDetailsModalProps) {
  if (!schedule) return null;

  const scheduledDate = new Date(schedule.data_hora);
  
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

  const totalPrice = schedule.services.reduce((sum, service) => {
    return sum + parseFloat(service.price || '0');
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6">
          {/* Status e Data/Hora */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
              <span className="font-medium text-sm sm:text-base">
                {format(scheduledDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            <Badge className={`${getStatusColor(schedule.status)} text-xs sm:text-sm px-2 py-1`}>
              {schedule.status}
            </Badge>
          </div>

          <Separator />

          {/* Informações do Cliente */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                <h3 className="font-medium text-sm sm:text-base">Informações do Cliente</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="space-y-2">
                  <p><strong>Nome:</strong> {schedule.user.name}</p>
                  <p><strong>Email:</strong> {schedule.user.email}</p>
                  <p><strong>Telefone:</strong> {schedule.user.telefone}</p>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-600">
                    <p>Informações de contato já exibidas acima</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Pet */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                <h3 className="font-medium text-sm sm:text-base">Informações do Pet</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="space-y-2">
                  <p><strong>Nome:</strong> {schedule.pet.nome}</p>
                  <p><strong>Sexo:</strong> {schedule.pet.sexo}</p>
                  <p><strong>Raça:</strong> {schedule.pet.raca}</p>
                  <p><strong>Peso:</strong> {schedule.pet.peso} kg</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Microchip:</strong> {schedule.pet.microchip_number || 'Não informado'}</p>
                </div>
              </div>
              
              {schedule.pet.microchip_number && (
                <>
                  <Separator className="my-3" />
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>Microchip registrado:</strong> {schedule.pet.microchip_number}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Serviços */}
          <Card>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                <h3 className="font-medium text-sm sm:text-base">Serviços Agendados</h3>
              </div>
              <div className="space-y-3">
                {schedule.services.map((service) => (
                  <div key={service.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{service.name}</p>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{service.description}</p>
                      <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 mt-1 text-xs text-gray-500">
                        <span>Duração: {service.duration} min</span>
                        <span>Categoria: {service.category}</span>
                      </div>
                    </div>
                    <div className="text-left sm:text-right shrink-0">
                      <p className="font-medium text-green-600 text-sm sm:text-base">
                        R$ {parseFloat(service.price || '0').toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-medium text-sm sm:text-base">
                  <span>Total:</span>
                  <span className="text-base sm:text-lg text-green-600">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {schedule.observacoes && (
            <Card>
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  <h3 className="font-medium text-sm sm:text-base">Observações</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 p-3 rounded-lg leading-relaxed">
                  {schedule.observacoes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}