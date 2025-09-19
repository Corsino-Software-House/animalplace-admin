import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Plus, 
  Edit, 
  Trash2, 
  MoreHorizontal,
  Clock,
  User
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { PROFESSIONALS_API } from '@/lib/api-routes';
import { api } from '@/lib/api';

interface WorkingHour {
  start: string;
  end: string;
  isWorking: boolean;
}

interface WorkingHours {
  monday: WorkingHour;
  tuesday: WorkingHour;
  wednesday: WorkingHour;
  thursday: WorkingHour;
  friday: WorkingHour;
  saturday: WorkingHour;
  sunday: WorkingHour;
}

interface Professional {
  id: string;
  name: string;
  specialty?: string;
  description?: string;
  status: 'active' | 'inactive';
  workingHours: WorkingHours;
  serviceCategories?: string[];
  serviceTypes?: string[];
  maxConcurrentAppointments: number;
  breakDuration: number;
  created_at: string;
  updated_at: string;
}

interface ProfessionalFormData {
  name: string;
  specialty: string;
  description: string;
  status: 'active' | 'inactive';
  workingHours: WorkingHours;
  serviceCategories: string[];
  serviceTypes: string[];
  maxConcurrentAppointments: number;
  breakDuration: number;
}

const defaultWorkingHours: WorkingHours = {
  monday: { start: '08:00', end: '18:00', isWorking: true },
  tuesday: { start: '08:00', end: '18:00', isWorking: true },
  wednesday: { start: '08:00', end: '18:00', isWorking: true },
  thursday: { start: '08:00', end: '18:00', isWorking: true },
  friday: { start: '08:00', end: '18:00', isWorking: true },
  saturday: { start: '08:00', end: '18:00', isWorking: false },
  sunday: { start: '08:00', end: '18:00', isWorking: false },
};

const defaultFormData: ProfessionalFormData = {
  name: '',
  specialty: '',
  description: '',
  status: 'active',
  workingHours: defaultWorkingHours,
  serviceCategories: [],
  serviceTypes: [],
  maxConcurrentAppointments: 1,
  breakDuration: 0,
};

const dayLabels: Record<keyof WorkingHours, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export function ProfessionalsManager() {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProfessional, setEditingProfessional] = useState<Professional | null>(null);
  const [formData, setFormData] = useState<ProfessionalFormData>(defaultFormData);

  useEffect(() => {
    fetchProfessionals();
  }, []);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      const response = await api.get(PROFESSIONALS_API.ALL);
      if (response) {
        const data = await response.data;
        setProfessionals(data);
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar profissionais",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar profissionais",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Preparar dados para envio, convertendo arrays vazios para null
      const dataToSend = {
        ...formData,
        serviceCategories: formData.serviceCategories.length > 0 ? formData.serviceCategories : null,
        serviceTypes: formData.serviceTypes.length > 0 ? formData.serviceTypes : null,
      };
      
      let response;
      
      if (editingProfessional) {
        response = await api.put(PROFESSIONALS_API.UPDATE(editingProfessional.id), dataToSend);
      } else {
        response = await api.post(PROFESSIONALS_API.CREATE, dataToSend);
      }

      if (response) {
        toast({
          title: "Sucesso",
          description: editingProfessional 
            ? "Profissional atualizado com sucesso" 
            : "Profissional criado com sucesso",
        });
        setDialogOpen(false);
        resetForm();
        fetchProfessionals();
      } else {
        toast({
          title: "Erro",
          description: "Falha ao salvar profissional",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao salvar profissional",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este profissional?')) return;
    
    try {
      const response = await api.delete(PROFESSIONALS_API.DELETE(id));

      if (response) {
        toast({
          title: "Sucesso",
          description: "Profissional excluído com sucesso",
        });
        fetchProfessionals();
      } else {
        toast({
          title: "Erro",
          description: "Falha ao excluir profissional",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao excluir profissional",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (professional: Professional) => {
    setEditingProfessional(professional);
    setFormData({
      name: professional.name,
      specialty: professional.specialty || '',
      description: professional.description || '',
      status: professional.status,
      workingHours: professional.workingHours,
      serviceCategories: professional.serviceCategories || [],
      serviceTypes: professional.serviceTypes || [],
      maxConcurrentAppointments: professional.maxConcurrentAppointments,
      breakDuration: professional.breakDuration,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData(defaultFormData);
    setEditingProfessional(null);
  };

  const updateWorkingHour = (day: keyof WorkingHours, field: keyof WorkingHour, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: {
          ...prev.workingHours[day],
          [field]: value,
        },
      },
    }));
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const formatTime = (time: string) => {
    return time.substring(0, 5);
  };

  if (loading) {
    return <div className="text-center py-8">Carregando profissionais...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Gerenciar Profissionais</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Profissional
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProfessional ? 'Editar Profissional' : 'Novo Profissional'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade</Label>
                  <Select
                    value={formData.specialty}
                    onValueChange={(value: string) => 
                      setFormData(prev => ({ ...prev, specialty: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a especialidade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Centro Estético">Centro Estético</SelectItem>
                      <SelectItem value="Operador de Logística">Operador de Logística</SelectItem>
                      {/* <SelectItem value="Veterinário Clínico">Veterinário Clínico</SelectItem>
                      <SelectItem value="Veterinário Cirúrgico">Veterinário Cirúrgico</SelectItem>
                      <SelectItem value="Técnico de Laboratório">Técnico de Laboratório</SelectItem>
                      <SelectItem value="Auxiliar Veterinário">Auxiliar Veterinário</SelectItem> */}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive') => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxConcurrent">Máx. Agendamentos Simultâneos</Label>
                  <Input
                    id="maxConcurrent"
                    type="number"
                    min="1"
                    value={formData.maxConcurrentAppointments}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      maxConcurrentAppointments: parseInt(e.target.value) 
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Horários de Trabalho</Label>
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(formData.workingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="w-20">
                        <Label className="capitalize">{dayLabels[day as keyof WorkingHours]}</Label>
                      </div>
                      <Switch
                        checked={hours.isWorking}
                        onCheckedChange={(checked) => updateWorkingHour(day as keyof WorkingHours, 'isWorking', checked)}
                      />
                      {hours.isWorking && (
                        <>
                          <Input
                            type="time"
                            value={hours.start}
                            onChange={(e) => updateWorkingHour(day as keyof WorkingHours, 'start', e.target.value)}
                            className="w-24"
                          />
                          <span>até</span>
                          <Input
                            type="time"
                            value={hours.end}
                            onChange={(e) => updateWorkingHour(day as keyof WorkingHours, 'end', e.target.value)}
                            className="w-24"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingProfessional ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Horários</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professionals.map((professional) => (
                <TableRow key={professional.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{professional.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{professional.specialty || '-'}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(professional.status)}>
                      {professional.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div className="text-sm">
                        {Object.entries(professional.workingHours)
                          .filter(([_, hours]) => hours.isWorking)
                          .map(([day, hours]) => (
                            <div key={day} className="capitalize">
                              {dayLabels[day as keyof WorkingHours]}: {formatTime(hours.start)}-{formatTime(hours.end)}
                            </div>
                          ))}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(professional)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(professional.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
