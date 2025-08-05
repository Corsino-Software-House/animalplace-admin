import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { X, Plus, Upload, Image, Trash2 } from 'lucide-react';
import { ReportType } from '@/types/reports';
import { useReportUpload } from '@/hooks/useReportUpload';
import { UploadProgressComponent } from './UploadProgressComponent';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateReportModal({ isOpen, onClose }: CreateReportModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<ReportType>(ReportType.SUPPORT);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { uploadReport, isUploading, uploadProgress, resetProgress } = useReportUpload();

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setType(ReportType.SUPPORT);
    setContactEmail('');
    setContactPhone('');
    setSelectedFiles([]);
    resetProgress();
    onClose();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Validate file types
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      alert('Alguns arquivos foram removidos por não atenderem aos critérios (apenas JPG, PNG, GIF, PDF até 10MB)');
    }

    setSelectedFiles(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim()) {
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('description', description.trim());
    formData.append('type', type);
    
    if (contactEmail.trim()) {
      formData.append('contactEmail', contactEmail.trim());
    }
    
    if (contactPhone.trim()) {
      formData.append('contactPhone', contactPhone.trim());
    }

    // Add files
    selectedFiles.forEach((file) => {
      formData.append('attachments', file);
    });

    try {
      await uploadReport(formData);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating report:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <Card className="w-full max-w-2xl max-h-[95vh] overflow-y-auto">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0 pb-4">
          <CardTitle className="text-lg">Criar Novo Relatório</CardTitle>
          <Button variant="outline" size="sm" onClick={handleClose} className="self-end sm:self-center">
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {uploadProgress && (
            <div className="mb-4">
              <UploadProgressComponent progress={uploadProgress} />
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="type">Tipo de Relatório</Label>
              <Select value={type} onValueChange={(value) => setType(value as ReportType)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ReportType.BUG}>🐛 Bug</SelectItem>
                  <SelectItem value={ReportType.FEATURE_REQUEST}>💡 Solicitação de Funcionalidade</SelectItem>
                  <SelectItem value={ReportType.SUPPORT}>🛡️ Suporte</SelectItem>
                  <SelectItem value={ReportType.COMPLAINT}>⚠️ Reclamação</SelectItem>
                  <SelectItem value={ReportType.SUGGESTION}>⭐ Sugestão</SelectItem>
                  <SelectItem value={ReportType.OTHER}>📝 Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Descreva brevemente o problema ou sugestão"
                required
                disabled={isUploading}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Forneça detalhes sobre o problema, sugestão ou solicitação"
                rows={4}
                required
                disabled={isUploading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Email de Contato</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="seu@email.com"
                  disabled={isUploading}
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Telefone de Contato</Label>
                <Input
                  id="contactPhone"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+55 11 99999-9999"
                  disabled={isUploading}
                />
              </div>
            </div>

            {/* File Upload Section */}
            <div>
              <Label>Anexos (até 5 imagens/PDFs)</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || selectedFiles.length >= 5}
                    className="w-full sm:w-auto"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Adicionar Arquivos
                  </Button>
                  <span className="text-sm text-gray-500">
                    {selectedFiles.length}/5 arquivos
                  </span>
                </div>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Selected Files List */}
                {selectedFiles.length > 0 && (
                  <div className="space-y-2 border rounded-lg p-3">
                    <h4 className="text-sm font-medium">Arquivos Selecionados:</h4>
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                        <div className="flex items-center space-x-2">
                          <Image className="h-4 w-4 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          disabled={isUploading}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose} 
                className="w-full sm:w-auto"
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                style={{ backgroundColor: '#95CA3C' }}
                className="text-white hover:opacity-90 w-full sm:w-auto"
                disabled={isUploading || !title.trim() || !description.trim()}
              >
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Relatório
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
