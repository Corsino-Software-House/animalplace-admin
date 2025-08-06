export interface CreateSchedulingRequest {
  pet_id: string;
  data_hora: string;
  serviceIds: string[];
  observacoes: string;
}

export interface AppointmentRequest {
  data_hora: string;
  pet_id: string;
  serviceIds: string[];
  observacoes: string;
  customer: {
    name: string;
    email: string;
    type: 'individual' | 'company';
    document: string;
    postalCode: string;
    addressNumber: string;
    phone: string;
    mobilePhone: string;
  };
  card: {
    number: string;
    holder_name: string;
    exp_month: number;
    exp_year: number;
    cvv: string;
  };
  payment_method: 'credit_card' | 'debit_card' | 'pix' | 'cash';
}

export interface Scheduling {
  id: string;
  message: string;
  pet: {
    id_pet: string;
    user_id: string;
    nome: string;
    tipo_animal: string;
    sexo: string;
    data_nascimento: string;
    raca: string;
    pelagem: string;
    peso: string;
    microchip_number: string;
    microchip_implantation_date: string;
    microchip_manufacturer: string;
    microchip_location: string;
    castrado: boolean;
    created_at: string;
    updated_at: string;
  };
  pet_id: string;
  user: {
    id: string;
    name: string;
    cpf: string;
    rg: string;
    endereco_completo: string;
    cep: string;
    telefone: string;
    email: string;
    passwordHash: string;
    createdAt: string;
    role: string;
    isEmailVerified: boolean;
    verificationToken: string | null;
    verificationTokenExpiration: string | null;
    resetToken: string | null;
    resetTokenExpiration: string | null;
    created_at: string;
    updated_at: string;
    expo_push_token: string | null;
  };
  user_id: string;
  data_hora: string;
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: string;
    duration: number;
    type: string;
    category: string;
    isActive: boolean;
    defaultLimits: {
      limit: number;
      period: string;
      carencyDays: number;
    };
    createdAt: string;
    updatedAt: string;
  }>;
  status: string;
  observacoes: string;
  google_event_id: string;
  created_at: string;
  updated_at: string;
}

export type SchedulingResponse = Scheduling[];

export interface AvailableSlot {
  date: string;
  availableSlots: string[];
}

export interface AvailabilityResponse {
  data?: AvailableSlot[];
  message: string;
  success: boolean;
}

export interface CheckServicePaymentPayload {
  petId: string;
  serviceIds: string[];
}

