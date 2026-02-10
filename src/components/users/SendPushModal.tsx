import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';
import { ApiError } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { usePlans } from '@/hooks/usePlans';
import { Switch } from '../ui/switch';

interface PlanOption {
  id: string;
  name: string;
  color?: string;
}

interface SendPushModalProps {
  trigger?: React.ReactNode;
  plans?: PlanOption[]; // lista de planos (opcional)
}

interface SendPushPayload {
  title: string;
  body: string;
  sendToAll: boolean;
  planIds?: string[];
}

export function SendPushModal({ trigger }: SendPushModalProps) {
  const [open, setOpen] = useState(false);
  const [sendToAll, setSendToAll] = useState(true);
  const [selectedPlans, setSelectedPlans] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const { data: plans = [] } = usePlans();

  const sendPushMutation = useMutation({
    mutationFn: async (payload: SendPushPayload) => {
      const { data } = await api.post(
        '/api/push-notification/send',
        payload,
      );
      return data;
    },
    onSuccess: () => {
      toast.success('Push notification enviada com sucesso!');
      setOpen(false);
      resetForm();
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message ||
          'Erro ao enviar push notification',
      );
    },
  });

  const resetForm = () => {
    setTitle('');
    setBody('');
    setSendToAll(true);
    setSelectedPlans([]);
  };

  const handleTogglePlan = (planId: string) => {
    setSelectedPlans((prev) =>
      prev.includes(planId)
        ? prev.filter((id) => id !== planId)
        : [...prev, planId],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !body) {
      toast.error('Título e mensagem são obrigatórios');
      return;
    }

    if (!sendToAll && selectedPlans.length === 0) {
      toast.error('Selecione pelo menos um plano');
      return;
    }

    const payload: SendPushPayload = {
      title,
      body,
      sendToAll,
      planIds: sendToAll ? undefined : selectedPlans,
    };

    sendPushMutation.mutate(payload);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      📢 Enviar Push
    </Button>
  );

   return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Enviar Push Notification</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Promoção especial 🎉"
            />
          </div>

          {/* Mensagem */}
          <div className="space-y-2">
            <Label htmlFor="body">Mensagem *</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Digite a mensagem do push notification"
              rows={4}
            />
          </div>

          {/* Switch enviar para todos */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="space-y-0.5">
              <Label>Enviar para todos</Label>
              <p className="text-sm text-muted-foreground">
                Dispara a notificação para todos os usuários ativos
              </p>
            </div>

            <Switch
              checked={sendToAll}
              onCheckedChange={(checked) => {
                setSendToAll(checked);
                if (checked) setSelectedPlans([]);
              }}
            />
          </div>

          {/* Seleção de planos */}
          {!sendToAll && (
            <div className="space-y-2">
              <Label>Planos *</Label>
              <div className="p-3 space-y-2 overflow-auto border rounded-md max-h-40">
                {plans.length === 0 && (
                  <p className="text-sm text-gray-500">
                    Nenhum plano disponível
                  </p>
                )}

                {plans.map((plan, index) => (
                  <div
                    key={plan?.id || index.toString()}
                    className="flex items-center space-x-2"
                  >
                    <Switch
                      checked={selectedPlans.includes(plan?.id || index.toString())}
                      onCheckedChange={() =>
                        handleTogglePlan(plan?.id || index.toString())
                      }
                    />
                    <span className="text-sm">{plan.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botões */}
          <div className="flex justify-end pt-4 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={sendPushMutation.isPending}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              className="text-white hover:opacity-90"
              style={{ backgroundColor: '#7C3AED' }}
              disabled={sendPushMutation.isPending}
            >
              {sendPushMutation.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              <Send className="w-4 h-4 mr-2" />
              Enviar Push
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
