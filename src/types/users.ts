export interface User {
  id: string;
  name: string;
  email: string;
  status: 'Ativo' | 'Administrador';
  createdAt: string;
  pets: UserPet[];
  totalPets: number;
  activePlans: number;
}

export interface UserPet {
  id_pet: string;
  nome: string;
  tipo_animal: string;
  sexo: 'Macho' | 'Fêmea';
  data_nascimento: string;
  idade: number;
  raca: string;
  pelagem: string;
  peso: string;
  castrado: boolean;
  created_at: string;
  subscriptions: UserPlan[];
  planAtivo?: UserPlan;
}

export interface UserPlanDetails {
  id: string;
  name: string;
  description: string;
  suggestedPrice: string;
  duration: number;
  isActive: boolean;
  mainColor: string;
}

export interface UserPlan {
  id_subscription: string;
  status: string;
  payment_status: string;
  start_date: string;
  due_date: string;
  last_payment_date: string | null;
  next_payment_date: string;
  plan: UserPlanDetails;
}