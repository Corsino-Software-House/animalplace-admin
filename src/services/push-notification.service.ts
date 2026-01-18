import { api } from "@/lib/api";

export interface SendPushRequest {
  title: string;
  body: string;
  sendToAll: boolean;
  planIds?: string[];
}

export async function sendPushNotification(data: SendPushRequest) {
  const response = await api.post("/push-notification/send", data);

  return response.data;
}
