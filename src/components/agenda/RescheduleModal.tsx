import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Scheduling } from '@/types/schedule';

interface RescheduleModalProps {
  schedule: Scheduling | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReschedule: (id: string, data: Scheduling) => Promise<boolean>;
  loading: boolean;
}

export function RescheduleModal({
  schedule,
  open,
  onOpenChange,
  onReschedule,
  loading,
}: RescheduleModalProps) {
  const [date, setDate] = useState<Date | undefined>();
  const [time, setTime] = useState('');
  const [observations, setObservations] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedule || !date || !time) return;

    const dateTime = new Date(date);
    const [hours, minutes] = time.split(':');
    dateTime.setHours(parseInt(hours), parseInt(minutes));

    const updatedSchedule: Scheduling = {
      ...schedule,
      data_hora: dateTime.toISOString(),
      observacoes: observations || schedule.observacoes,
    };

    const success = await onReschedule(schedule.id, updatedSchedule);
    if (success) {
      onOpenChange(false);
      setDate(undefined);
      setTime('');
      setObservations('');
    }
  };

  if (!schedule) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reagendar Consulta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente</Label>
            <Input value={schedule.user.name} disabled />
          </div>
          
          <div className="space-y-2">
            <Label>Pet</Label>
            <Input value={schedule.pet.nome} disabled />
          </div>

          <div className="space-y-2">
            <Label>Serviços</Label>
            <div className="text-sm text-gray-600">
              {schedule.services.map(service => service.name).join(', ')}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nova Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Novo Horário</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações (opcional)</Label>
            <Textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observações sobre o reagendamento..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !date || !time}
              style={{ backgroundColor: '#95CA3C' }}
              className="text-white hover:opacity-90"
            >
              {loading ? 'Reagendando...' : 'Reagendar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}