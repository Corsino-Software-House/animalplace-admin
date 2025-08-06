import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Upload, AlertCircle } from 'lucide-react';
import { UploadProgress } from '@/hooks/useReportUpload';

interface UploadProgressComponentProps {
  progress: UploadProgress;
}

export function UploadProgressComponent({ progress }: UploadProgressComponentProps) {
  const getIcon = () => {
    if (progress.completed) {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (progress.failed) {
      return <XCircle className="h-5 w-5 text-red-600" />;
    } else {
      return <Upload className="h-5 w-5 text-blue-600 animate-pulse" />;
    }
  };

  return (
    <div className="space-y-3 p-4 border rounded-lg bg-white">
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className="text-sm font-medium">{progress.stage}</span>
      </div>
      
      <div className="space-y-1">
        <Progress 
          value={progress.progress} 
          className="h-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>{progress.progress}%</span>
          {progress.currentFile && progress.totalFiles && (
            <span>
              Arquivo {progress.currentFile} de {progress.totalFiles}
            </span>
          )}
        </div>
      </div>

      {progress.error && (
        <div className="flex items-center space-x-2 text-red-600 text-sm">
          <AlertCircle className="h-4 w-4" />
          <span>{progress.error}</span>
        </div>
      )}
    </div>
  );
}
