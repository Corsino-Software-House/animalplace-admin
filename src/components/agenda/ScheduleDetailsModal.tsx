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
  Phone,
  Mail,
  MapPin,
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
  const petBirthDate = new Date(schedule.pet.data_nascimento);
  
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
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Detalhes do Agendamento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Data/Hora */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="font-medium">
                {format(scheduledDate, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
              </span>
            </div>
            <Badge className={getStatusColor(schedule.status)}>
              {schedule.status}
            </Badge>
          </div>

          <Separator />

          {/* Informações do Cliente */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <User className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">Informações do Cliente</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nome:</strong> {schedule.user.name}</p>
                  <p><strong>CPF:</strong> {schedule.user.cpf}</p>
                  <p><strong>RG:</strong> {schedule.user.rg}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    <span>{schedule.user.telefone}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <Mail className="h-3 w-3" />
                    <span>{schedule.user.email}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span className="text-xs">{schedule.user.endereco_completo}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Pet */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <Heart className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">Informações do Pet</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nome:</strong> {schedule.pet.nome}</p>
                  <p><strong>Tipo:</strong> {schedule.pet.tipo_animal}</p>
                  <p><strong>Raça:</strong> {schedule.pet.raca}</p>
                  <p><strong>Sexo:</strong> {schedule.pet.sexo}</p>
                </div>
                <div>
                  <p><strong>Nascimento:</strong> {format(petBirthDate, 'dd/MM/yyyy', { locale: ptBR })}</p>
                  <p><strong>Peso:</strong> {schedule.pet.peso} kg</p>
                  <p><strong>Pelagem:</strong> {schedule.pet.pelagem}</p>
                  <p><strong>Castrado:</strong> {schedule.pet.castrado ? 'Sim' : 'Não'}</p>
                </div>
              </div>
              
              {schedule.pet.microchip_number && (
                <>
                  <Separator className="my-3" />
                  <div className="text-xs text-gray-600">
                    <p><strong>Microchip:</strong> {schedule.pet.microchip_number}</p>
                    <p><strong>Fabricante:</strong> {schedule.pet.microchip_manufacturer}</p>
                    <p><strong>Local:</strong> {schedule.pet.microchip_location}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Serviços */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <h3 className="font-medium">Serviços Agendados</h3>
              </div>
              <div className="space-y-3">
                {schedule.services.map((service) => (
                  <div key={service.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-gray-600">{service.description}</p>
                      <div className="flex gap-4 mt-1 text-xs text-gray-500">
                        <span>Duração: {service.duration} min</span>
                        <span>Categoria: {service.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">
                        R$ {parseFloat(service.price || '0').toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between items-center font-medium">
                  <span>Total:</span>
                  <span className="text-lg text-green-600">
                    R$ {totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          {schedule.observacoes && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <h3 className="font-medium">Observações</h3>
                </div>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
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