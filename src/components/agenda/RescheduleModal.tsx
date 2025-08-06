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
  onReschedule: (id: string, data: { data_hora: string }) => Promise<boolean>;
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

    const rescheduleData = {
      data_hora: dateTime.toISOString(),
    };

    const success = await onReschedule(schedule.id, rescheduleData);
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
      <DialogContent className="sm:max-w-[500px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Reagendar Consulta</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Cliente</Label>
            <Input value={schedule.user.name} disabled className="text-sm sm:text-base" />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Pet</Label>
            <Input value={schedule.pet.nome} disabled className="text-sm sm:text-base" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Serviços</Label>
            <div className="text-xs sm:text-sm text-gray-600 p-2 bg-gray-50 rounded-md">
              {schedule.services.map(service => service.name).join(', ')}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-sm sm:text-base">Nova Data</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal text-sm sm:text-base h-9 sm:h-10',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                    {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : 'Selecionar data'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
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
              <Label className="text-sm sm:text-base">Novo Horário</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-8 sm:pl-10 text-sm sm:text-base h-9 sm:h-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm sm:text-base">Observações (opcional)</Label>
            <Textarea
              value={observations}
              onChange={(e) => setObservations(e.target.value)}
              placeholder="Observações sobre o reagendamento..."
              rows={3}
              className="text-sm sm:text-base resize-none"
            />
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto text-sm sm:text-base h-9 sm:h-10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !date || !time}
              style={{ backgroundColor: '#95CA3C' }}
              className="w-full sm:w-auto text-white hover:opacity-90 text-sm sm:text-base h-9 sm:h-10"
            >
              {loading ? 'Reagendando...' : 'Reagendar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}