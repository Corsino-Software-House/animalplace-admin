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
  pet: {
    id_pet: string;
    nome: string;
    sexo: string;
    raca: string;
    peso: string;
    microchip_number: string | null;
  };
  pet_id: string;
  user: {
    id: string;
    name: string;
    telefone: string;
    email: string;
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

