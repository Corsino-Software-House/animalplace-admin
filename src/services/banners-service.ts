import { api } from "@/lib/api";
import { BANNERS_ROUTE, GET_ONE_BANNER_ROUTE } from "@/lib/api-routes";
import { Banner, BannerResponse } from "@/types/banners";

export interface BannerFormData extends Omit<Banner, 'imagem_url'> {
  image?: File;
}

export const getBanners = async (): Promise<BannerResponse[]> => {
  const response = await api.get<BannerResponse[]>(BANNERS_ROUTE());
  console.log('getBanners', response.data);
  return response.data;
};

const createFormData = (banner: BannerFormData): FormData => {
  const formData = new FormData();
  
  formData.append('titulo', banner.titulo);
  formData.append('descricao', banner.descricao);
  formData.append('link_url', banner.link_url);
  formData.append('data_inicio', banner.data_inicio);
  formData.append('data_fim', banner.data_fim);
  formData.append('ativo', banner.ativo.toString());
  
  if (banner.image) {
    formData.append('image', banner.image);
  }
  
  return formData;
};

export const createBanner = async (banner: BannerFormData): Promise<BannerResponse> => {
  const formData = createFormData(banner);
  const response = await api.post<BannerResponse>(BANNERS_ROUTE(), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const updateBanner = async (id: string, banner: BannerFormData): Promise<BannerResponse> => {
  const formData = createFormData(banner);
  const response = await api.patch<BannerResponse>(GET_ONE_BANNER_ROUTE(id), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteBanner = async (id: string): Promise<BannerResponse> => {
  const response = await api.delete<BannerResponse>(GET_ONE_BANNER_ROUTE(id));
  return response.data;
};