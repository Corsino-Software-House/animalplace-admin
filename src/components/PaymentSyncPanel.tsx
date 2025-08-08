import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, CheckCircle, DollarSign, RefreshCw, Activity } from 'lucide-react';
import { usePaymentDiagnosis, usePaymentStats } from '@/hooks/usePaymentSync';

export function PaymentSyncPanel() {
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [statsResult, setStatsResult] = useState<any>(null);
  
  const diagnosisMutation = usePaymentDiagnosis();
  const statsMutation = usePaymentStats();

  const handleDiagnosis = async () => {
    try {
      const result = await diagnosisMutation.mutateAsync();
      setDiagnosisResult(result);
      
      const stats = await statsMutation.mutateAsync();
      setStatsResult(stats);
    } catch (error) {
      console.error('Erro no diagnóstico:', error);
    }
  };

  const handleRefreshStats = async () => {
    try {
      const stats = await statsMutation.mutateAsync();
      setStatsResult(stats);
    } catch (error) {
      console.error('Erro ao atualizar stats:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Estatísticas de Pagamentos
          </CardTitle>
          <CardDescription>
            Status atual dos pagamentos e receita
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Button 
              onClick={handleRefreshStats}
              variant="outline"
              size="sm"
              disabled={statsMutation.isPending}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${statsMutation.isPending ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
          
          {statsResult && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  R$ {statsResult.totalRevenue.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">Receita Total</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {statsResult.completedCount}
                </div>
                <div className="text-sm text-muted-foreground">Pagos</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {statsResult.pendingCount}
                </div>
                <div className="text-sm text-muted-foreground">Pendentes</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {statsResult.failedCount}
                </div>
                <div className="text-sm text-muted-foreground">Falharam</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Diagnóstico e Sincronização
          </CardTitle>
          <CardDescription>
            Identifica e corrige problemas de sincronização entre pagamentos e Asaas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button 
              onClick={handleDiagnosis}
              disabled={diagnosisMutation.isPending}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${diagnosisMutation.isPending ? 'animate-spin' : ''}`} />
              {diagnosisMutation.isPending ? 'Executando...' : 'Executar Diagnóstico'}
            </Button>

            {diagnosisResult && (
              <div className="space-y-4">
                <Separator />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <Badge variant="outline" className="justify-center p-2">
                    {diagnosisResult.paymentsFound} Pagamentos
                  </Badge>
                  <Badge variant="outline" className="justify-center p-2">
                    {diagnosisResult.subscriptionsFound} Assinaturas
                  </Badge>
                  <Badge variant={diagnosisResult.issuesFixed > 0 ? "default" : "secondary"} className="justify-center p-2">
                    {diagnosisResult.issuesFixed} Corrigidos
                  </Badge>
                  <Badge variant="outline" className="justify-center p-2">
                    {diagnosisResult.fixes.length} Ações
                  </Badge>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Diagnóstico
                  </h4>
                  <ScrollArea className="h-32 border rounded p-3">
                    <div className="space-y-1 text-sm">
                      {diagnosisResult.diagnosis.map((item: string, index: number) => (
                        <div key={index} className="font-mono text-xs">
                          {item}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {diagnosisResult.fixes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Correções Aplicadas
                    </h4>
                    <ScrollArea className="h-32 border rounded p-3">
                      <div className="space-y-1 text-sm">
                        {diagnosisResult.fixes.map((item: string, index: number) => (
                          <div key={index} className="font-mono text-xs text-green-600">
                            {item}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">ℹ️ Sincronização Automática</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="space-y-1">
            <li>• A sincronização automática roda a cada 6 horas</li>
            <li>• Verificação diária de integridade à meia-noite</li>
            <li>• Problemas são corrigidos automaticamente quando possível</li>
            <li>• Use este painel para diagnósticos manuais ou urgentes</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
