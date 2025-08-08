import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface UploadProgress {
  progress: number;
  stage: string;
  currentFile?: number;
  totalFiles?: number;
  completed?: boolean;
  failed?: boolean;
  error?: string;
  result?: unknown;
}

export const useReportUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const queryClient = useQueryClient();

  const uploadReport = useCallback(async (formData: FormData) => {
    setIsUploading(true);
    setUploadProgress({
      progress: 0,
      stage: 'Preparando upload...',
    });

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const token = localStorage.getItem('auth_token');

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setUploadProgress({
            progress: percentComplete,
            stage: `Enviando dados... ${percentComplete}%`,
          });
        }
      });

      xhr.addEventListener('load', () => {
        setIsUploading(false);
        
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const result = JSON.parse(xhr.responseText);
            setUploadProgress({
              progress: 100,
              stage: 'Upload concluído com sucesso!',
              completed: true,
              result,
            });
            
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['report-statistics'] });
            
            setTimeout(() => {
              setUploadProgress(null);
            }, 2000);
            
            resolve(result);
          } catch {
            setUploadProgress({
              progress: 0,
              stage: 'Erro ao processar resposta',
              failed: true,
              error: 'Erro ao processar resposta do servidor',
            });
            reject(new Error('Erro ao processar resposta do servidor'));
          }
        } else {
          let errorMessage = 'Erro no upload';
          try {
            const errorResponse = JSON.parse(xhr.responseText);
            errorMessage = errorResponse.message || errorMessage;
          } catch {
          }
          
          setUploadProgress({
            progress: 0,
            stage: 'Erro no upload',
            failed: true,
            error: errorMessage,
          });
          
          reject(new Error(errorMessage));
        }
      });

      xhr.addEventListener('error', () => {
        setIsUploading(false);
        setUploadProgress({
          progress: 0,
          stage: 'Erro de conexão',
          failed: true,
          error: 'Erro de conexão com o servidor',
        });
        reject(new Error('Erro de conexão com o servidor'));
      });

      xhr.addEventListener('timeout', () => {
        setIsUploading(false);
        setUploadProgress({
          progress: 0,
          stage: 'Timeout no upload',
          failed: true,
          error: 'Timeout: o upload demorou muito para completar',
        });
        reject(new Error('Timeout: o upload demorou muito para completar'));
      });

      xhr.open('POST', `${import.meta.env.VITE_API_URL}/reports`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.timeout = 5 * 60 * 1000;
      
      xhr.send(formData);
    });
  }, [queryClient]);

  const resetProgress = useCallback(() => {
    setUploadProgress(null);
    setIsUploading(false);
  }, []);

  return {
    uploadReport,
    isUploading,
    uploadProgress,
    resetProgress,
  };
};
