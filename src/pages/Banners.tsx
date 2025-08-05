import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, MoreHorizontal, Eye, Edit, Trash2, Image as ImageIcon, Loader2, Calendar, Link2, BarChart3, X } from 'lucide-react';
import { getBanners, createBanner, updateBanner, deleteBanner, BannerFormData } from '@/services/banners-service';
import { BannerResponse } from '@/types/banners';
import { colors } from '@/theme/colors';

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

  const { data: bannersData, isLoading, error } = useQuery<BannerResponse[]>({
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
      
      // Create preview URL
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
    
    // Reset file input
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
      return { text: 'Inativo', color: colors.gray_light };
    }
    if (now < startDate) {
      return { text: 'Agendado', color: colors.yellow };
    }
    if (now > endDate) {
      return { text: 'Expirado', color: colors.red };
    }
    return { text: 'Ativo', color: colors.green };
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: colors.background }}>
        <Card className="w-full max-w-md" style={{ borderColor: colors.red }}>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.red}20` }}>
                <ImageIcon className="h-8 w-8" style={{ color: colors.red }} />
              </div>
              <h3 className="font-semibold text-lg mb-2" style={{ color: colors.red }}>
                Erro ao carregar banners
              </h3>
              <p className="text-sm" style={{ color: colors.gray_light }}>
                {error instanceof Error ? error.message : 'Erro desconhecido'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-2 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto space-y-4 lg:space-y-6">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <div className="flex items-center justify-center gap-2 lg:gap-3 mb-3 lg:mb-4">
            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.purple }}>
              <ImageIcon className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: colors.black }}>
              Gerenciar Banners
            </h1>
          </div>
          <p className="text-base lg:text-lg max-w-2xl mx-auto px-4" style={{ color: colors.gray_light }}>
            Gerencie banners promocionais exibidos no aplicativo do cliente
          </p>
        </div>

        <div className="flex justify-end">
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button style={{ backgroundColor: colors.green }} className="text-white hover:opacity-90">
                <Plus className="mr-2 h-4 w-4" />
                Criar Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle style={{ color: colors.black }}>Criar Novo Banner</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.gray_light }}>Título</label>
                  <Input
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    placeholder="Digite o título do banner"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.gray_light }}>Descrição</label>
                  <Textarea
                    value={formData.descricao}
                    onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                    placeholder="Digite a descrição do banner"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.gray_light }}>Imagem do Banner</label>
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
                  <label className="text-sm font-medium" style={{ color: colors.gray_light }}>URL de Destino</label>
                  <Input
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="https://exemplo.com/destino"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium" style={{ color: colors.gray_light }}>Data de Início</label>
                    <Input
                      type="date"
                      value={formData.data_inicio}
                      onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium" style={{ color: colors.gray_light }}>Data de Fim</label>
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
                  <label htmlFor="ativo" className="text-sm font-medium" style={{ color: colors.gray_light }}>
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
                    style={{ backgroundColor: colors.green }}
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

        {/* Banners Grid */}
        <Card style={{ backgroundColor: colors.background, borderColor: colors.gray_ultra_light }}>
          <CardHeader style={{ backgroundColor: colors.purple }}>
            <CardTitle className="text-xl font-semibold flex items-center gap-2 text-white">
              <ImageIcon className="h-5 w-5" />
              Todos os Banners ({isLoading ? '...' : bannersData?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${colors.purple}20` }}>
                  <Loader2 className="h-8 w-8 animate-spin" style={{ color: colors.purple }} />
                </div>
                <p className="font-medium" style={{ color: colors.black }}>Carregando banners...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {bannersData?.map((banner) => {
                  const status = getStatusBadge(banner);
                  return (
                    <Card key={banner.id} className="border rounded-lg" style={{ borderColor: colors.gray_ultra_light }}>
                      <CardHeader className="pb-4">
                        <div className="aspect-video rounded-lg overflow-hidden" style={{ backgroundColor: colors.background }}>
                          {banner.imagem_url ? (
                            <img 
                              src={banner.imagem_url} 
                              alt={banner.titulo}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                                if (fallback) fallback.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full flex items-center justify-center" style={{ display: banner.imagem_url ? 'none' : 'flex' }}>
                            <ImageIcon className="h-12 w-12" style={{ color: colors.gray_light }} />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <h3 className="font-semibold" style={{ color: colors.black }}>{banner.titulo}</h3>
                            <Badge style={{ backgroundColor: status.color, color: 'white', border: 'none' }}>
                              {status.text}
                            </Badge>
                          </div>
                          <p className="text-sm line-clamp-2" style={{ color: colors.gray_light }}>
                            {banner.descricao}
                          </p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm" style={{ color: colors.gray_light }}>
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(banner.data_inicio)} - {formatDate(banner.data_fim)}</span>
                            </div>
                            {banner.link_url && (
                              <div className="flex items-center gap-2 text-sm" style={{ color: colors.gray_light }}>
                                <Link2 className="h-3 w-3" />
                                <span className="truncate">{banner.link_url}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-4 text-sm" style={{ color: colors.gray_light }}>
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
                                <Button variant="ghost" className="h-8 w-8 p-0 bg-transparent">
                                  <MoreHorizontal className="h-4 w-4" style={{ color: colors.gray_light }} />
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
              <DialogTitle style={{ color: colors.black }}>Editar Banner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium" style={{ color: colors.gray_light }}>Título</label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Digite o título do banner"
                />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: colors.gray_light }}>Descrição</label>
                <Textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Digite a descrição do banner"
                />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: colors.gray_light }}>Imagem do Banner</label>
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
                    <div className="text-xs" style={{ color: colors.gray_light }}>
                      Selecione uma nova imagem para substituir a atual
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium" style={{ color: colors.gray_light }}>URL de Destino</label>
                <Input
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  placeholder="https://exemplo.com/destino"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.gray_light }}>Data de Início</label>
                  <Input
                    type="date"
                    value={formData.data_inicio}
                    onChange={(e) => setFormData({ ...formData, data_inicio: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ color: colors.gray_light }}>Data de Fim</label>
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
                <label htmlFor="ativo-edit" className="text-sm font-medium" style={{ color: colors.gray_light }}>
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
                  style={{ backgroundColor: colors.green }}
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
              <AlertDialogTitle style={{ color: colors.black }}>Deletar Banner</AlertDialogTitle>
              <AlertDialogDescription style={{ color: colors.gray_light }}>
                Tem certeza que deseja deletar o banner "{selectedBanner?.titulo}"? Esta ação não pode ser desfeita.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                style={{ backgroundColor: colors.red }}
                className="text-white"
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
    </div>
  );
}