import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  AlertTriangle,
  Bug,
  Lightbulb,
  MessageSquare,
  Shield,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  MessageCircle,
  BarChart3,
  Filter,
  Search,
  Plus,
  Eye,
  Trash2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { 
  ReportType, 
  ReportStatus, 
  ReportPriority
} from '@/types/reports';
import { reportsService } from '@/services/reports-service';
import { CreateReportModal } from '@/components/report/CreateReportModal';
import { ViewReportModal } from '@/components/report/ViewReportModal';
import { RespondReportModal } from '@/components/report/RespondReportModal';
import { DeleteReportModal } from '@/components/report/DeleteReportModal';

const getTypeIcon = (type: ReportType) => {
  switch (type) {
    case ReportType.BUG:
      return Bug;
    case ReportType.FEATURE_REQUEST:
      return Lightbulb;
    case ReportType.SUPPORT:
      return Shield;
    case ReportType.COMPLAINT:
      return AlertTriangle;
    case ReportType.SUGGESTION:
      return Star;
    default:
      return MessageSquare;
  }
};

const getTypeLabel = (type: ReportType) => {
  const labels = {
    [ReportType.BUG]: 'Bug',
    [ReportType.FEATURE_REQUEST]: 'Solicitação de Funcionalidade',
    [ReportType.SUPPORT]: 'Suporte',
    [ReportType.COMPLAINT]: 'Reclamação',
    [ReportType.SUGGESTION]: 'Sugestão',
    [ReportType.OTHER]: 'Outro',
  };
  return labels[type];
};

const getStatusBadge = (status: ReportStatus) => {
  const configs = {
    [ReportStatus.PENDING]: { 
      icon: Clock, 
      color: 'bg-yellow-100 text-yellow-800',
      label: 'Pendente'
    },
    [ReportStatus.IN_PROGRESS]: { 
      icon: MessageCircle, 
      color: 'bg-blue-100 text-blue-800',
      label: 'Em Progresso'
    },
    [ReportStatus.RESOLVED]: { 
      icon: CheckCircle, 
      color: 'bg-green-100 text-green-800',
      label: 'Resolvido'
    },
    [ReportStatus.CLOSED]: { 
      icon: XCircle, 
      color: 'bg-gray-100 text-gray-800',
      label: 'Fechado'
    },
    [ReportStatus.REJECTED]: { 
      icon: AlertCircle, 
      color: 'bg-red-100 text-red-800',
      label: 'Rejeitado'
    },
  };

  const config = configs[status];
  const Icon = config.icon;

  return (
    <Badge className={config.color}>
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
};

const getPriorityBadge = (priority: ReportPriority) => {
  const configs = {
    [ReportPriority.LOW]: { color: 'bg-gray-100 text-gray-800', label: 'Baixa' },
    [ReportPriority.MEDIUM]: { color: 'bg-blue-100 text-blue-800', label: 'Média' },
    [ReportPriority.HIGH]: { color: 'bg-orange-100 text-orange-800', label: 'Alta' },
    [ReportPriority.CRITICAL]: { color: 'bg-red-100 text-red-800', label: 'Crítica' },
  };

  const config = configs[priority];
  return (
    <Badge className={config.color} variant="outline">
      {config.label}
    </Badge>
  );
};

export function Reports() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRespondModalOpen, setIsRespondModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [respondMode, setRespondMode] = useState<'respond' | 'complete'>('respond');

  // Modal handlers
  const handleViewReport = (report: any) => {
    setSelectedReport(report);
    setIsViewModalOpen(true);
  };

  const handleRespondReport = (report: any) => {
    setSelectedReport(report);
    setRespondMode('respond');
    setIsRespondModalOpen(true);
  };

  const handleCompleteReport = (report: any) => {
    setSelectedReport(report);
    setRespondMode('complete');
    setIsRespondModalOpen(true);
  };

  const handleDeleteReport = (report: any) => {
    setSelectedReport(report);
    setIsDeleteModalOpen(true);
  };

  const closeAllModals = () => {
    setIsViewModalOpen(false);
    setIsRespondModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedReport(null);
  };

  // Real API calls using the reports service
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsService.getReports(1, 50), // Get more reports for better demo
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['report-statistics'],
    queryFn: () => reportsService.getStatistics(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  if (reportsLoading || statsLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle case when no data is returned from API
  if (!reportsData || !statistics) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Relatórios dos Usuários</h1>
            <p className="text-gray-600 mt-2">
              Gerencie relatórios, bugs, sugestões e suporte dos usuários da plataforma
            </p>
          </div>
        </div>
        <div className="text-center py-12">
          <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Erro ao carregar relatórios</p>
          <p className="text-sm text-gray-400 mt-1">
            Verifique sua conexão ou tente novamente mais tarde
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Relatórios dos Usuários</h1>
          <p className="text-gray-600 mt-2">
            Gerencie relatórios, bugs, sugestões e suporte dos usuários da plataforma
          </p>
        </div>
        <Button 
          style={{ backgroundColor: '#95CA3C' }} 
          className="text-white hover:opacity-90"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Relatório
        </Button>
      </div>

      {/* Statistics Overview */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{statistics.total}</p>
                <p className="text-sm text-gray-600">Total de Relatórios</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {(statistics.byStatus[ReportStatus.PENDING] || 0) + (statistics.byStatus[ReportStatus.IN_PROGRESS] || 0)}
                </p>
                <p className="text-sm text-gray-600">Pendentes</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {(statistics.byStatus[ReportStatus.RESOLVED] || 0) + (statistics.byStatus[ReportStatus.CLOSED] || 0)}
                </p>
                <p className="text-sm text-gray-600">Resolvidos</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {(statistics.byPriority[ReportPriority.HIGH] || 0) + (statistics.byPriority[ReportPriority.CRITICAL] || 0)}
                </p>
                <p className="text-sm text-gray-600">Alta Prioridade</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Reports Management */}
      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <TabsList >
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="pending">Pendentes</TabsTrigger>
            <TabsTrigger value="in-progress">Em Progresso</TabsTrigger>
            <TabsTrigger value="resolved">Resolvidos</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {reportsData?.reports && reportsData.reports.length > 0 ? (
            reportsData.reports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {(() => {
                          const Icon = getTypeIcon(report.type);
                          return <Icon className="h-6 w-6 text-gray-600" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{report.title}</h3>
                          {getStatusBadge(report.status)}
                          {getPriorityBadge(report.priority)}
                        </div>
                        <p className="text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{getTypeLabel(report.type)}</span>
                          <span>•</span>
                          <span>{report.user?.name || 'Usuário Anônimo'}</span>
                          <span>•</span>
                          <span>{formatDate(report.createdAt)}</span>
                          {report.contactEmail && (
                            <>
                              <span>•</span>
                              <span>{report.contactEmail}</span>
                            </>
                          )}
                        </div>
                        {report.adminResponse && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800">
                              <strong>Resposta do Admin:</strong> {report.adminResponse}
                            </p>
                            {report.responseDate && (
                              <p className="text-xs text-green-600 mt-1">
                                Respondido por {report.respondedBy} em {formatDate(report.responseDate)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline" className="text-gray-600 hover:text-gray-800" onClick={() => handleViewReport(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-800" onClick={() => handleRespondReport(report)}>
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300" onClick={() => handleDeleteReport(report)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum relatório encontrado</p>
              <p className="text-sm text-gray-400 mt-1">
                Os relatórios dos usuários aparecerão aqui
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {/* Filter and show only pending reports */}
          {reportsData?.reports
            ?.filter(report => report.status === ReportStatus.PENDING)
            .map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-yellow-100 rounded-lg">
                        {(() => {
                          const Icon = getTypeIcon(report.type);
                          return <Icon className="h-6 w-6 text-yellow-600" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{report.title}</h3>
                          {getStatusBadge(report.status)}
                          {getPriorityBadge(report.priority)}
                        </div>
                        <p className="text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{getTypeLabel(report.type)}</span>
                          <span>•</span>
                          <span>{report.user?.name || 'Usuário Anônimo'}</span>
                          <span>•</span>
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90" onClick={() => handleRespondReport(report)}>
                        Responder
                      </Button>
                      <Button size="sm" variant="outline" className="text-gray-600 hover:text-gray-800" onClick={() => handleViewReport(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-4">
          {/* Filter and show only in-progress reports */}
          {reportsData?.reports
            ?.filter(report => report.status === ReportStatus.IN_PROGRESS)
            .map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {(() => {
                          const Icon = getTypeIcon(report.type);
                          return <Icon className="h-6 w-6 text-blue-600" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{report.title}</h3>
                          {getStatusBadge(report.status)}
                          {getPriorityBadge(report.priority)}
                        </div>
                        <p className="text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{getTypeLabel(report.type)}</span>
                          <span>•</span>
                          <span>{report.user?.name || 'Usuário Anônimo'}</span>
                          <span>•</span>
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90" onClick={() => handleCompleteReport(report)}>
                        Finalizar
                      </Button>
                      <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-800" onClick={() => handleViewReport(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          {/* Filter and show only resolved/closed reports */}
          {reportsData?.reports
            ?.filter(report => [ReportStatus.RESOLVED, ReportStatus.CLOSED].includes(report.status))
            .map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow border-l-4 border-green-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="p-2 bg-green-100 rounded-lg">
                        {(() => {
                          const Icon = getTypeIcon(report.type);
                          return <Icon className="h-6 w-6 text-green-600" />;
                        })()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{report.title}</h3>
                          {getStatusBadge(report.status)}
                          {getPriorityBadge(report.priority)}
                        </div>
                        <p className="text-gray-600 mb-2">{report.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{getTypeLabel(report.type)}</span>
                          <span>•</span>
                          <span>{report.user?.name || 'Usuário Anônimo'}</span>
                          <span>•</span>
                          <span>{formatDate(report.createdAt)}</span>
                        </div>
                        {report.adminResponse && (
                          <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-sm text-green-800">
                              <strong>Resposta:</strong> {report.adminResponse}
                            </p>
                            {report.responseDate && (
                              <p className="text-xs text-green-600 mt-1">
                                Respondido por {report.respondedBy} em {formatDate(report.responseDate)}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button size="sm" variant="outline" className="text-gray-600 hover:text-gray-800" onClick={() => handleViewReport(report)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
        </TabsContent>
      </Tabs>

      {/* Create Report Modal */}
      <CreateReportModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />

      {/* View Report Modal */}
      <ViewReportModal
        isOpen={isViewModalOpen}
        onClose={closeAllModals}
        report={selectedReport}
      />

      {/* Respond Report Modal */}
      <RespondReportModal
        isOpen={isRespondModalOpen}
        onClose={closeAllModals}
        report={selectedReport}
        mode={respondMode}
      />

      {/* Delete Report Modal */}
      <DeleteReportModal
        isOpen={isDeleteModalOpen}
        onClose={closeAllModals}
        report={selectedReport}
      />
    </div>
  );
}