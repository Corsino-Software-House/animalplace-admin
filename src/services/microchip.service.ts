import { api } from "@/lib/api";
import { 
  PETS_ROUTE, 
  GET_ONE_PET_ROUTE,
  DELETE_MICROCHIPPED_PET_ROUTE,
  MICROCHIPPED_PETS_ROUTE,
  MICROCHIP_STATS_ROUTE
} from "@/lib/api-routes";

export interface MicrochipStats {
  totalPets: number;
  microchippedPets: number;
  pendingMicrochips: number;
  thisMonthMicrochips: number;
  lastMonthMicrochips: number;
  growthPercentage: number;
}

export interface MicrochipData {
  microchip_number: string;
  microchip_manufacturer?: string;
  microchip_location?: string;
}

export interface Pet {
  id_pet: string;
  nome: string;
  tipo_animal: string;
  microchip_number?: string;
  microchip_implantation_date?: string;
  microchip_manufacturer?: string;
  microchip_location?: string;
  user?: {
    nome: string;
  };
}

export interface MicrochippedPet {
  id_pet: string;
  nome: string;
  microchip_number: string;
  ownerName: string;
  microchip_implantation_date: string;
  microchip_location: string;
  tipo: string;
  pelagem: string;
  raca: string;
}

export interface RegisterMicrochipRequest {
  petId: string;
  microchipData: MicrochipData;
  notes?: string;
}

export interface UpdatePetRequest {
  nome?: string;
  tipo_animal?: string;
  raca?: string;
  pelagem?: string;
  microchip_number?: string;
  microchip_manufacturer?: string;
  microchip_location?: string;
  microchip_implantation_date?: string;
}

export const getStats = async (): Promise<MicrochipStats> => {
  const response = await api.get<MicrochipStats>(MICROCHIP_STATS_ROUTE());
  return response.data;
};

export const getAllPets = async (): Promise<Pet[]> => {
  const response = await api.get<Pet[]>(PETS_ROUTE());
  return response.data;
};

export const getNotMicrochippedPets = async (): Promise<Pet[]> => {
  const response = await api.get<Pet[]>(`${PETS_ROUTE()}/getAllNotMicrochipedPets`);
  return response.data;
};

export const getMicrochippedPets = async (): Promise<MicrochippedPet[]> => {
  const response = await api.get<MicrochippedPet[]>(MICROCHIPPED_PETS_ROUTE());
  return response.data;
};

export const registerMicrochip = async (data: RegisterMicrochipRequest) => {
  const response = await api.patch(GET_ONE_PET_ROUTE(data.petId), {
    microchip_number: data.microchipData.microchip_number,
    microchip_manufacturer: data.microchipData.microchip_manufacturer,
    microchip_location: data.microchipData.microchip_location,
    microchip_implantation_date: new Date().toISOString().split('T')[0] // Data atual
  });
  return response.data;
};

export const updatePet = async (petId: string, data: UpdatePetRequest) => {
  const response = await api.patch(GET_ONE_PET_ROUTE(petId), data);
  return response.data;
};

export const deleteMicrochippedPet = async (petId: string) => {
  const response = await api.delete(DELETE_MICROCHIPPED_PET_ROUTE(petId));
  return response.data;
};
