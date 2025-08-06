export type Period = 'year' | 'month' | 'week' | 'day';

export interface ServiceLimit {
  limit: number;
  period: Period;
  carencyDays: number;
}

export interface ConsultationTypeLimit {
  limit: number;
  carencyDays: number;
}

export interface SpecialRules {
  microchipFree: boolean;
  aestheticViaApp: boolean;
  consultationTypes: Record<string, ConsultationTypeLimit>;
  highComplexitySurgeries?: {
    services: string[];
    limit: number;
    carencyDays: number;
  };
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: number;
  type: string;
  category: string;
  isActive: boolean;
  defaultLimits: ServiceLimit;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id?: string;
  name: string;
  description: string;
  suggestedPrice: number;
  duration: number;
  isActive: boolean;
  mainColor: string;
  serviceLimits: {
    exam: ServiceLimit;
    surgery: ServiceLimit;
    vaccine: ServiceLimit;
    procedure: ServiceLimit;
    anesthesia: ServiceLimit;
    consultation: ServiceLimit;
    hospitalization: ServiceLimit;
    bath_and_grooming: ServiceLimit;
  };
  freeServices?: string[];
  appPurchaseServices?: string[];
  allowedServiceNames?: string[];
  servicesToCreate?: ServiceToCreate[];
  specialRules: SpecialRules;
  services?: Service[];
}

export interface ServiceToCreate {
  name: string;
  description: string;
  price: number;
  duration: number;
  type: string;
  category: string;
  isActive: boolean;
  defaultLimits: ServiceLimit;
}
