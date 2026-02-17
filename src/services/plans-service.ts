import { api } from "@/lib/api";
import {
  ONE_PLAN_ROUTE,
  PLANS_ROUTE,
  PLAN_ADD_SERVICES,
  PLAN_DEPENDENCIES,
  PLAN_REMOVE_SERVICES,
} from "@/lib/api-routes";
import { Plan } from "@/types/plans";

export interface ManageServicesDto {
  serviceIds: string[];
}

export interface PlanDependencies {
  subscriptionsCount: number;
  servicesCount: number;
  canDelete: boolean;
}

export const getPlans = async () => {
  const response = await api.get<Plan[]>(PLANS_ROUTE());
  return response.data;
};

export const getPlanById = async (id: string) => {
  const response = await api.get<Plan>(ONE_PLAN_ROUTE(id));
  return response.data;
};

export const createPlan = async (plan: Omit<Plan, "id">) => {
  const response = await api.post<Plan>(PLANS_ROUTE(), plan);
  return response.data;
};

export const updatePlan = async (id: string, plan: Partial<Plan>) => {
  const response = await api.patch<Plan>(ONE_PLAN_ROUTE(id), plan);
  return response.data;
};

export const deletePlan = async (id: string) => {
  const response = await api.delete(ONE_PLAN_ROUTE(id));
  return response.data;
};

export const addServicesToPlan = async (
  planId: string,
  serviceIds: string[],
) => {
  const response = await api.post<Plan>(PLAN_ADD_SERVICES(planId), {
    serviceIds,
  });
  return response.data;
};

export const removeServicesFromPlan = async (
  planId: string,
  serviceIds: string[],
) => {
  const response = await api.post<Plan>(PLAN_REMOVE_SERVICES(planId), {
    serviceIds,
  });
  return response.data;
};

export const getPlanDependencies = async (planId: string) => {
  const response = await api.get<PlanDependencies>(PLAN_DEPENDENCIES(planId));
  return response.data;
};
