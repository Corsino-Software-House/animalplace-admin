import { api } from "@/lib/api";
import { DELETE_SCHEDULE_SERVICE_ROUTE, GET_SCHEDULE_SERVICE_ROUTE, RESCHEDULE_SERVICE_ROUTE } from "@/lib/api-routes";
import { Scheduling } from "@/types/schedule";

export const getScheduleService = async (): Promise<Scheduling[]> => {
  const response = await api.get<Scheduling[]>(GET_SCHEDULE_SERVICE_ROUTE());
  return response.data;
};

export const rescheduleService = async (id: string, data: Scheduling): Promise<Scheduling> => {
  const response = await api.post<Scheduling>(RESCHEDULE_SERVICE_ROUTE(id), data);
  return response.data;
};

export const deleteScheduleService = async (id: string): Promise<Scheduling> => {
  const response = await api.delete<Scheduling>(DELETE_SCHEDULE_SERVICE_ROUTE(id));
  return response.data;
};