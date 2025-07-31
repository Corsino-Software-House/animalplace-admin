import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, X } from 'lucide-react';
import { Report } from '@/types/reports';
import { reportsService } from '@/services/reports-service';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeleteReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

export function DeleteReportModal({ isOpen, onClose, report }: DeleteReportModalProps) {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportsService.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
      queryClient.invalidateQueries({ queryKey: ['report-statistics'] });
      onClose();
    },
  });

  const handleDelete = () => {
    if (report) {
      deleteMutation.mutate(report.id);
    }
  };

  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <span>Confirmar Exclusão</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              Tem certeza que deseja excluir este relatório? Esta ação não pode ser desfeita.
            </p>
            
            <div className="p-3 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 text-sm">{report.title}</h4>
              <p className="text-gray-600 text-xs mt-1">
                Por: {report.user?.name || 'Usuário Anônimo'}
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose} disabled={deleteMutation.isPending}>
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Excluindo...
                  </>
                ) : (
                  'Excluir'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
