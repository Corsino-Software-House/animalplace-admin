import { api } from "@/lib/api";
import { BANNERS_ROUTE, GET_ONE_BANNER_ROUTE } from "@/lib/api-routes";
import { Banner, BannerResponse } from "@/types/banners";


export const getBanners = async (): Promise<BannerResponse[]> => {
  const response = await api.get<BannerResponse[]>(BANNERS_ROUTE());
  console.log('getBanners', response.data);
  return response.data;
};

export const createBanner = async (banner: Banner): Promise<BannerResponse> => {
  const response = await api.post<BannerResponse>(BANNERS_ROUTE(), banner);
  return response.data;
};

export const updateBanner = async (id: string, banner: Banner): Promise<BannerResponse> => {
  const response = await api.patch<BannerResponse>(GET_ONE_BANNER_ROUTE(id), banner);
  return response.data;
};

export const deleteBanner = async (id: string): Promise<BannerResponse> => {
  const response = await api.delete<BannerResponse>(GET_ONE_BANNER_ROUTE(id));
  return response.data;
};