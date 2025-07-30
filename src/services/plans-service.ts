import { api } from "@/lib/api";
import { GET_ONE_PLAN_ROUTE, PLANS_ROUTE } from "@/lib/api-routes";
import { Plan } from "@/types/plans";

export const getPlans = async () => {
  const response = await api.get<Plan[]>(PLANS_ROUTE());
  return response.data;
};

export const getPlanById = async (id: string) => {
  const response = await api.get<Plan>(GET_ONE_PLAN_ROUTE(id));
  return response.data;
};

export const createPlan = async (plan: Omit<Plan, 'id'>) => {
  const response = await api.post<Plan>(PLANS_ROUTE(), plan);
  return response.data;
};

export const updatePlan = async (id: string, plan: Partial<Plan>) => {
  const response = await api.put<Plan>(GET_ONE_PLAN_ROUTE(id), plan);
  return response.data;
};

export const deletePlan = async (id: string) => {
  const response = await api.delete(GET_ONE_PLAN_ROUTE(id));
  return response.data;
};