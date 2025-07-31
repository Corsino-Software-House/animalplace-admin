import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Send } from 'lucide-react';
import { Report } from '@/types/reports';
import { reportsService } from '@/services/reports-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface RespondReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
  mode: 'respond' | 'complete';
}

export function RespondReportModal({ isOpen, onClose, report, mode }: RespondReportModalProps) {
  const [response, setResponse] = useState('');
  const queryClient = useQueryClient();

  const respondMutation = useMutation({
    mutationFn: (data: { id: string; response: string }) => 
      mode === 'respond' 
        ? reportsService.respondToReport(data.id, data.response)
        : reportsService.completeReport(data.id, data.response),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report-statistics'] });
      handleClose();
    },
  });

  const handleClose = () => {
    setResponse('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!report || !response.trim()) {
      return;
    }

    respondMutation.mutate({
      id: report.id,
      response: response.trim(),
    });
  };

  if (!isOpen || !report) return null;

  const title = mode === 'respond' ? 'Responder Relatório' : 'Finalizar Relatório';
  const buttonText = mode === 'respond' ? 'Enviar Resposta' : 'Finalizar';
  const placeholder = mode === 'respond' 
    ? 'Digite sua resposta ao usuário...' 
    : 'Digite a resolução final (opcional)...';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>{title}</CardTitle>
          <Button variant="outline" size="sm" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Report Details */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">{report.title}</h4>
              <p className="text-gray-600 text-sm mb-2">{report.description}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>Por: {report.user?.name || 'Usuário Anônimo'}</span>
                <span>•</span>
                <span>{new Date(report.createdAt).toLocaleDateString('pt-BR')}</span>
                {report.contactEmail && (
                  <>
                    <span>•</span>
                    <span>{report.contactEmail}</span>
                  </>
                )}
              </div>
            </div>

            {/* Response Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="response">
                  {mode === 'respond' ? 'Sua Resposta *' : 'Resolução Final'}
                </Label>
                <Textarea
                  id="response"
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder={placeholder}
                  rows={6}
                  required={mode === 'respond'}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  style={{ backgroundColor: '#95CA3C' }}
                  className="text-white hover:opacity-90"
                  disabled={respondMutation.isPending || (mode === 'respond' && !response.trim())}
                >
                  {respondMutation.isPending ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      {mode === 'respond' ? 'Enviando...' : 'Finalizando...'}
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      {buttonText}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
