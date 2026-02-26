/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bell, Loader2, Send, AlertTriangle, Info } from 'lucide-react';
import { api } from '@/lib/api';

interface NotifyTermsChangePayload {
  effectiveDate: string;
  summary: string;
  detailsUrl: string;
}

async function sendTermsChangeNotification(payload: NotifyTermsChangePayload) {
  const { data } = await api.post('/plans/notify-terms-change', payload);
  return data;
}

interface NotifyTermsChangeModalProps {
  trigger?: React.ReactNode;
}

export function NotifyTermsChangeModal({ trigger }: NotifyTermsChangeModalProps) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    effectiveDate: '',
    summary: '',
    detailsUrl: '',
  });

  const mutation = useMutation({
    mutationFn: sendTermsChangeNotification,
    onSuccess: () => {
      toast.success('Notificações enviadas com sucesso!', {
        description: 'Todos os assinantes ativos foram notificados por email.',
      });
      setOpen(false);
      resetState();
    },
    onError: (error: any) => {
      toast.error('Erro ao enviar notificações', {
        description: error?.response?.data?.message || 'Tente novamente em instantes.',
      });
    },
  });

  // Data mínima: amanhã
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  // Dias até a vigência
  const daysUntilEffective = form.effectiveDate
    ? Math.ceil(
        (new Date(form.effectiveDate).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : null;

  const isFormValid =
    form.effectiveDate.trim() !== '' &&
    form.summary.trim() !== '' &&
    form.detailsUrl.trim() !== '';

  const resetState = () => {
    setForm({ effectiveDate: '', summary: '', detailsUrl: '' });
  };

  const handleSubmit = () => {
    if (!isFormValid) return;
    mutation.mutate({
      effectiveDate: form.effectiveDate,
      summary: form.summary.trim(),
      detailsUrl: form.detailsUrl.trim(),
    });
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm">
      <Bell className="w-4 h-4 mr-2" />
      Notificar Mudança de Termos
    </Button>
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetState();
      }}
    >
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

      <DialogContent className="max-w-[95vw] sm:max-w-[90vw] lg:max-w-[560px] max-h-[95vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Notificação de Mudança de Termos
          </DialogTitle>
          <DialogDescription>
            Envia um email para <strong>todos os assinantes ativos</strong> comunicando uma
            atualização nos termos e condições. As alterações são comunicadas com antecedência
            para que os clientes possam se preparar.
          </DialogDescription>
        </DialogHeader>

        {/* Alertas de informação */}
        <div className="space-y-2">
          <Alert>
            <Info className="w-4 h-4" />
            <AlertDescription>
              O email é disparado imediatamente para todos os assinantes ativos, sem duplicatas
              por usuário. Recomenda-se enviar com pelo menos <strong>30 dias de antecedência</strong>.
            </AlertDescription>
          </Alert>

          {daysUntilEffective !== null && daysUntilEffective < 30 && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                {daysUntilEffective < 15
                  ? `Antecedência muito curta: apenas ${daysUntilEffective} dia(s). O recomendado é 30 dias.`
                  : `Antecedência abaixo do recomendado: ${daysUntilEffective} dia(s). O ideal é 30 dias.`}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Formulário */}
        <div className="flex-1 mt-2 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="effectiveDate" className="text-sm font-medium">
              Data de Vigência
            </Label>
            <Input
              id="effectiveDate"
              type="date"
              min={minDate}
              value={form.effectiveDate}
              onChange={(e) => setForm((f) => ({ ...f, effectiveDate: e.target.value }))}
            />
            {daysUntilEffective !== null && daysUntilEffective >= 30 && (
              <p className="text-xs text-green-600">✓ {daysUntilEffective} dias de antecedência</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="summary" className="text-sm font-medium">
              Resumo das Mudanças
            </Label>
            <Textarea
              id="summary"
              placeholder="Ex: Atualização da política de cobertura de cirurgias de alta complexidade. Novos limites de carência entram em vigor."
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-gray-500">
              Este texto será exibido em destaque no email enviado ao cliente.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="detailsUrl" className="text-sm font-medium">
              Link para os Termos Completos
            </Label>
            <Input
              id="detailsUrl"
              type="url"
              placeholder="https://seusite.com.br/termos"
              value={form.detailsUrl}
              onChange={(e) => setForm((f) => ({ ...f, detailsUrl: e.target.value }))}
            />
          </div>
        </div>

        {/* Footer com ações */}
        <div className="flex flex-col items-center justify-between gap-3 pt-4 border-t sm:flex-row">
          <div className="text-sm text-gray-600">
            {isFormValid && (
              <span>Pronto para enviar</span>
            )}
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={mutation.isPending}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!isFormValid || mutation.isPending}
              className="flex-1 text-white hover:opacity-90 sm:flex-none"
              style={{ backgroundColor: '#4f46e5' }}
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar Notificação
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}