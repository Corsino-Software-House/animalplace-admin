import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  Image as ImageIcon, 
  Loader2, 
  Calendar, 
  Link2, 
  BarChart3, 
  X,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { getBanners, createBanner, updateBanner, deleteBanner, BannerFormData } from '@/services/banners-service';
import { BannerResponse } from '@/types/banners';

export function Banners() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<BannerResponse | null>(null);
  const [formData, setFormData] = useState<BannerFormData>({
    titulo: '',
    descricao: '',
    link_url: '',
    data_inicio: '',
    data_fim: '',
    ativo: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [existingImageUrl, setExistingImageUrl] = useState<string>('');

  const queryClient = useQueryClient();

  const { data: bannersData, isLoading, error, refetch } = useQuery<BannerResponse[]>({
    queryKey: ['banners'],
    queryFn: getBanners,
  });

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setIsCreateOpen(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, banner }: { id: string; banner: BannerFormData }) => 
      updateBanner(id, banner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setIsEditOpen(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['banners'] });
      setIsDeleteOpen(false);
      setSelectedBanner(null);
    },
  });

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      link_url: '',
      data_inicio: '',
      data_fim: '',
      ativo: true
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setExistingImageUrl('');
    setSelectedBanner(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setFormData({ ...formData, image: file });
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setExistingImageUrl('');
    setFormData({ ...formData, image: undefined });
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleCreate = () => {
    const submitData = { ...formData };
    if (selectedFile) {
      submitData.image = selectedFile;
    }
    createMutation.mutate(submitData);
  };

  const handleEdit = () => {
    if (selectedBanner) {
      const submitData = { ...formData };
      if (selectedFile) {
        submitData.image = selectedFile;
      }
      updateMutation.mutate({ id: selectedBanner.id, banner: submitData });
    }
  };

  const handleDelete = () => {
    if (selectedBanner) {
      deleteMutation.mutate(selectedBanner.id);
    }
  };

  const openEditDialog = (banner: BannerResponse) => {
    setSelectedBanner(banner);
    setFormData({
      titulo: banner.titulo,
      descricao: banner.descricao,
      link_url: banner.link_url,
      data_inicio: banner.data_inicio.split('T')[0],
      data_fim: banner.data_fim.split('T')[0],
      ativo: banner.ativo
    });
    setSelectedFile(null);
    setPreviewUrl('');
    setExistingImageUrl(banner.imagem_url);
    setIsEditOpen(true);
  };

  const openDeleteDialog = (banner: BannerResponse) => {
    setSelectedBanner(banner);
    setIsDeleteOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (banner: BannerResponse) => {
    const now = new Date();
    const startDate = new Date(banner.data_inicio);
    const endDate = new Date(banner.data_fim);

    if (!banner.ativo) {
      return { text: 'Inativo', className: 'bg-gray-400 text-white' };
    }
    if (now < startDate) {
      return { text: 'Agendado', className: 'bg-yellow-500 text-white' };
    }
    if (now > endDate) {
      return { text: 'Expirado', className: 'bg-red-500 text-white' };
    }
    return { text: 'Ativo', className: 'bg-green-500 text-white' };
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Banners</h1>
            <p className="text-gray-600 mt-2">Gerencie banners promocionais do aplicativo</p>
          </div>
        </div>
        
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="h-4 w-4" />
              <p>{error instanceof Error ? error.message : 'Erro ao carregar banners'}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Banners</h1>
          <p className="text-gray-600 mt-2">Gerencie banners promocionais exibidos no aplicativo</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => refetch()}
            disabled={isLoading}
            size="sm"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: '#95CA3C' }} className="text-white hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Criar Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Criar Novo Banner</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Título</label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Digite o título do banner"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Descrição</label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Digite a descrição do banner"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Imagem do Banner</label>
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                    {previewUrl && (
                      <div className="relative mt-2">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-w-xs max-h-32 object-cover rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 left-1 h-6 w-6 p-0"
                          onClick={removeImage}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">URL de Destino</label>
                  <Input
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="https://exemplo.com/destino"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de Início</label>
                    <Input
                      type="date"
                      value={formData.data_inicio}
                      onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Data de Fim</label>
                    <Input
                      type="date"
                      value={formData.data_fim}
                      onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="ativo"
                    checked={formData.ativo}
                    onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
                  />
                  <label htmlFor="ativo" className="text-sm font-medium text-gray-600">
                    Banner ativo
                  </label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={handleCreate}
                    disabled={createMutation.isPending}
                    style={{ backgroundColor: '#95CA3C' }}
                    className="text-white"
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      'Criar Banner'
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Lista de Banners ({bannersData?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="border rounded-lg">
                  <CardHeader className="pb-4">
                    <Skeleton className="aspect-video rounded-lg" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : bannersData?.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum banner encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {bannersData?.map((banner) => {
                const status = getStatusBadge(banner);
                return (
                  <Card key={banner.id} className="border rounded-lg border-gray-200">
                    <CardHeader className="pb-4">
                      <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                        {banner.imagem_url ? (
                          <img 
                            src={banner.imagem_url} 
                            alt={banner.titulo}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className="w-full h-full flex items-center justify-center" style={{ display: banner.imagem_url ? 'none' : 'flex' }}>
                          <ImageIcon className="h-12 w-12 text-gray-400" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900">{banner.titulo}</h3>
                          <Badge className={status.className}>
                            {status.text}
                          </Badge>
                        </div>
                        <p className="text-sm line-clamp-2 text-gray-600">
                          {banner.descricao}
                        </p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(banner.data_inicio)} - {formatDate(banner.data_fim)}</span>
                          </div>
                          {banner.link_url && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Link2 className="h-3 w-3" />
                              <span className="truncate">{banner.link_url}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              <span>{banner.total_cliques} cliques</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              <span>{banner.total_compras} compras</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end pt-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4 text-gray-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(banner.link_url, '_blank')}>
                                <Eye className="mr-2 h-4 w-4" />
                                Visualizar
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(banner)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => openDeleteDialog(banner)}
                                className="text-red-600"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Deletar
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Banner</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Título</label>
              <Input
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Digite o título do banner"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Descrição</label>
              <Textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Digite a descrição do banner"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Imagem do Banner</label>
                <div className="space-y-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  {(previewUrl || existingImageUrl) && (
                    <div className="relative mt-2">
                      <img 
                        src={previewUrl || existingImageUrl} 
                        alt="Preview" 
                        className="max-w-xs max-h-32 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={removeImage}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                {!previewUrl && !existingImageUrl && (
                  <div className="text-xs text-gray-500">
                    Selecione uma nova imagem para substituir a atual
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">URL de Destino</label>
              <Input
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="https://exemplo.com/destino"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Data de Início</label>
                <Input
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Data de Fim</label>
                <Input
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => setFormData({ ...formData, data_fim: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ativo-edit"
                checked={formData.ativo}
                onChange={(e) => setFormData({ ...formData, ativo: e.target.checked })}
              />
              <label htmlFor="ativo-edit" className="text-sm font-medium text-gray-600">
                Banner ativo
              </label>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleEdit}
                disabled={updateMutation.isPending}
                style={{ backgroundColor: '#95CA3C' }}
                className="text-white"
              >
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar Banner</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar o banner "{selectedBanner?.titulo}"? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deletando...
                </>
              ) : (
                'Deletar'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}