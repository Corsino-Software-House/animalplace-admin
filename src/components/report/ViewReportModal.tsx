import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, User, Mail, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Report, ReportType, ReportStatus, ReportPriority } from '@/types/reports';

interface ViewReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Report | null;
}

const typeLabels: Record<ReportType, string> = {
  [ReportType.BUG]: 'Bug',
  [ReportType.FEATURE_REQUEST]: 'Solicitação',
  [ReportType.SUPPORT]: 'Suporte',
  [ReportType.COMPLAINT]: 'Reclamação',
  [ReportType.SUGGESTION]: 'Sugestão',
  [ReportType.OTHER]: 'Outro',
};

const statusLabels: Record<ReportStatus, string> = {
  [ReportStatus.PENDING]: 'Pendente',
  [ReportStatus.IN_PROGRESS]: 'Em Progresso',
  [ReportStatus.RESOLVED]: 'Resolvido',
  [ReportStatus.CLOSED]: 'Fechado',
  [ReportStatus.REJECTED]: 'Rejeitado',
};

const priorityLabels: Record<ReportPriority, string> = {
  [ReportPriority.LOW]: 'Baixa',
  [ReportPriority.MEDIUM]: 'Média',
  [ReportPriority.HIGH]: 'Alta',
  [ReportPriority.CRITICAL]: 'Crítica',
};

const statusColors: Record<ReportStatus, string> = {
  [ReportStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
  [ReportStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-800',
  [ReportStatus.RESOLVED]: 'bg-green-100 text-green-800',
  [ReportStatus.CLOSED]: 'bg-gray-100 text-gray-800',
  [ReportStatus.REJECTED]: 'bg-red-100 text-red-800',
};

const priorityColors: Record<ReportPriority, string> = {
  [ReportPriority.LOW]: 'bg-green-100 text-green-800',
  [ReportPriority.MEDIUM]: 'bg-yellow-100 text-yellow-800',
  [ReportPriority.HIGH]: 'bg-orange-100 text-orange-800',
  [ReportPriority.CRITICAL]: 'bg-red-100 text-red-800',
};

const StatusIcon = ({ status }: { status: ReportStatus }) => {
  switch (status) {
    case ReportStatus.PENDING:
      return <Clock className="h-4 w-4" />;
    case ReportStatus.IN_PROGRESS:
      return <AlertCircle className="h-4 w-4" />;
    case ReportStatus.RESOLVED:
    case ReportStatus.CLOSED:
      return <CheckCircle className="h-4 w-4" />;
    default:
      return null;
  }
};

export function ViewReportModal({ isOpen, onClose, report }: ViewReportModalProps) {
  if (!isOpen || !report) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <StatusIcon status={report.status} />
            <span className="truncate">Detalhes do Relatório</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose} className="self-end sm:self-center">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Header with badges */}
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <Badge className={statusColors[report.status]}>
                {statusLabels[report.status]}
              </Badge>
              <Badge className={priorityColors[report.priority]}>
                {priorityLabels[report.priority]}
              </Badge>
              <Badge variant="outline">
                {typeLabels[report.type]}
              </Badge>
            </div>

            {/* Title and Description */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 break-words">
                {report.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                {report.description}
              </p>
            </div>

            {/* User Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {report.user?.name || 'Usuário Anônimo'}
                  </p>
                  <p className="text-xs text-gray-500">Reportado por</p>
                </div>
              </div>

              {report.contactEmail && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {report.contactEmail}
                    </p>
                    <p className="text-xs text-gray-500">Email de contato</p>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(report.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-gray-500">Criado em</p>
                </div>
              </div>

              {report.updatedAt && report.updatedAt !== report.createdAt && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(report.updatedAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    <p className="text-xs text-gray-500">Atualizado em</p>
                  </div>
                </div>
              )}
            </div>

            {/* Response */}
            {report.adminResponse && (
              <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-900 mb-2">Resposta da Equipe</h4>
                <p className="text-blue-800 whitespace-pre-wrap">{report.adminResponse}</p>
                {report.responseDate && (
                  <p className="text-blue-600 text-xs mt-2">
                    Respondido em: {new Date(report.responseDate).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {report.respondedBy && ` por ${report.respondedBy}`}
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center sm:justify-end pt-6">
            <Button onClick={onClose} className="w-full sm:w-auto">
              Fechar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
