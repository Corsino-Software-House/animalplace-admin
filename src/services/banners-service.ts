import { api } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api-routes";
import { Banner, BannerResponse } from "@/types/banners";


export const getBanners = async (): Promise<BannerResponse[]> => {
  const response = await api.get<BannerResponse[]>(API_ENDPOINTS.BANNERS);
  console.log('getBanners', response.data);
  return response.data;
};

export const createBanner = async (banner: Banner): Promise<BannerResponse> => {
  const response = await api.post<BannerResponse>(API_ENDPOINTS.BANNERS, banner);
  return response.data;
};

export const updateBanner = async (id: string, banner: Banner): Promise<BannerResponse> => {
  const response = await api.patch<BannerResponse>(`${API_ENDPOINTS.BANNERS}/${id}`, banner);
  return response.data;
};

export const deleteBanner = async (id: string): Promise<BannerResponse> => {
  const response = await api.delete<BannerResponse>(`${API_ENDPOINTS.BANNERS}/${id}`);
  return response.data;
};