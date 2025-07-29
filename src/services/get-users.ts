import { API_ENDPOINTS } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { User } from "@/types/users";

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>(API_ENDPOINTS.GET_USERS);
  return response.data;
};
