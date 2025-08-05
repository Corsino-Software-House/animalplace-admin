export interface Banner {
  titulo: string;
  descricao: string;
  imagem_url: string;
  link_url: string;
  data_inicio: string;
  data_fim: string;
  ativo: boolean;
}

export interface BannerFormData extends Omit<Banner, 'imagem_url'> {
  image?: File;
}

export interface BannerResponse {
  id: string;
  titulo: string;
  descricao: string;
  imagem_url: string;
  link_url: string;
  nuvemshop_product_id: string | null;
  total_compras: number;
  total_cliques: number;
  data_inicio: string;
  data_fim: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}