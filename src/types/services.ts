export enum ServiceType {
  CONSULTATION = 'consultation',
  VACCINE = 'vaccine',
  EXAM = 'exam',
  PROCEDURE = 'procedure',
  SURGERY = 'surgery',
  AESTHETIC = 'aesthetic',
  HOSPITALIZATION = 'hospitalization',
  ANESTHESIA = 'anesthesia',
  BATH_AND_GROOMING = 'bath_and_grooming',
}

export enum ServiceCategory {
  CLINICAL = 'clinical',
  AESTHETIC = 'aesthetic',
  SURGICAL = 'surgical',
  DIAGNOSTIC = 'diagnostic',
  VACCINE = 'vaccine',
}

export interface ServiceLimit {
  limit: number;
  period: 'year' | 'month';
  carencyDays: number;
}

export interface ServiceDto {
  name: string;
  description: string;
  price: number;
  duration: number;
  type: ServiceType;
  category: ServiceCategory;
  isActive?: boolean;
  defaultLimits?: ServiceLimit;
}

export interface Service extends ServiceDto {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceWithSubscriptionInfo extends Service {
  subscriptionInfo: {
    covered: boolean;
    available: boolean;
    remainingUses: number;
    totalLimit: number;
    usedCount: number;
    savings: number;
    carencyStatus: string;
    inCarency: boolean;
  };
}

export interface ServiceUsage {
  id: string;
  service_id: string;
  user_id: string;
  subscription_id: string;
  pet_id: string | null;
  usage_date: string;
  notes?: string;
}
