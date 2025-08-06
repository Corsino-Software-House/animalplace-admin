import { api } from "@/lib/api";
import { ONE_SERVICE_ROUTE, SERVICES_ROUTE } from "@/lib/api-routes";
import { ServiceDto } from "@/types/services";

export function getServices() {
  return api.get(SERVICES_ROUTE());
}

export function createService(service: ServiceDto) {
  return api.post(SERVICES_ROUTE(), service);
}

export function updateService(id: string, service: ServiceDto) {
  return api.patch(ONE_SERVICE_ROUTE(id), service);
}

export function deleteService(id: string) {
  return api.delete(ONE_SERVICE_ROUTE(id));
}

export function getServiceById(id: string) {
  return api.get(ONE_SERVICE_ROUTE(id));
}