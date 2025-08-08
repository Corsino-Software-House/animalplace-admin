import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Edit, Trash2, Clock, DollarSign, AlertCircle } from 'lucide-react';
import { useServiceById } from '@/hooks/useServices';
import { ServiceType, ServiceCategory } from '@/types/services';
import { EditServiceModal } from './EditServiceModal';
import { DeleteServiceDialog } from './DeleteServiceDialog';

interface ServiceDetailsModalProps {
  serviceId: string;
  trigger?: React.ReactNode;
}

const getCategoryLabel = (category: ServiceCategory) => {
  const labels = {
    [ServiceCategory.CLINICAL]: 'Clínico',
    [ServiceCategory.AESTHETIC]: 'Estético',
    [ServiceCategory.SURGICAL]: 'Cirúrgico',
    [ServiceCategory.DIAGNOSTIC]: 'Diagnóstico',
    [ServiceCategory.VACCINE]: 'Vacina',
  };
  return labels[category] || category;
};

const getTypeLabel = (type: ServiceType) => {
  const labels = {
    [ServiceType.CONSULTATION]: 'Consulta',
    [ServiceType.VACCINE]: 'Vacina',
    [ServiceType.EXAM]: 'Exame',
    [ServiceType.PROCEDURE]: 'Procedimento',
    [ServiceType.SURGERY]: 'Cirurgia',
    [ServiceType.AESTHETIC]: 'Estético',
    [ServiceType.HOSPITALIZATION]: 'Internação',
    [ServiceType.ANESTHESIA]: 'Anestesia',
    [ServiceType.BATH_AND_GROOMING]: 'Banho e Tosa',
  };
  return labels[type] || type;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
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

const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

export function ServiceDetailsModal({ serviceId, trigger }: ServiceDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const { data: service, isLoading, error } = useServiceById(serviceId, open);

  const defaultTrigger = (
    <Button variant="ghost" size="sm">
      <Eye className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[95vh] overflow-y-auto mx-4 sm:mx-0">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            {isLoading ? 'Carregando...' : service?.name || 'Detalhes do Serviço'}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-6 w-full" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-6 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Erro ao carregar serviço</h3>
              <p className="text-gray-600">Não foi possível carregar os detalhes do serviço.</p>
            </div>
          </div>
        ) : service ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
              <Badge 
                variant={service.isActive ? 'default' : 'secondary'}
                style={service.isActive ? { backgroundColor: '#95CA3C', color: 'white' } : {}}
                className="text-sm"
              >
                {service.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Descrição</h4>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                {service.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-gray-600">Preço</span>
                  </div>
                  <div className="text-xl font-bold text-green-600">
                    {formatPrice(service.price)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-600">Duração</span>
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {formatDuration(service.duration)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">Tipo</span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {getTypeLabel(service.type)}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-600">Categoria</span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {getCategoryLabel(service.category)}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {service.defaultLimits && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Limites Padrão</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600 block">Limite de Uso</span>
                    <span className="font-semibold">{service.defaultLimits.limit}x</span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600 block">Período</span>
                    <span className="font-semibold">
                      {service.defaultLimits.period === 'month' ? 'Mensal' : 'Anual'}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-gray-600 block">Carência</span>
                    <span className="font-semibold">{service.defaultLimits.carencyDays} dias</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3 border-t pt-4">
              <h4 className="font-medium text-gray-900">Informações do Sistema</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Criado em:</span>
                  <div className="font-medium">{formatDate(service.createdAt)}</div>
                </div>
                <div>
                  <span className="text-gray-600">Última atualização:</span>
                  <div className="font-medium">{formatDate(service.updatedAt)}</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
              <EditServiceModal 
                service={service}
                trigger={
                  <Button className="w-full sm:flex-1" variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Serviço
                  </Button>
                }
              />
              <DeleteServiceDialog 
                service={service}
                trigger={
                  <Button className="w-full sm:flex-1" variant="outline">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir Serviço
                  </Button>
                }
              />
              <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="w-full sm:w-auto"
              >
                Fechar
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}