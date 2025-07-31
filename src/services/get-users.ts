import { GET_USERS_ROUTE } from "@/lib/api-routes";
import { api } from "@/lib/api";
import { User } from "@/types/users";

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>(GET_USERS_ROUTE());
  return response.data;
};
