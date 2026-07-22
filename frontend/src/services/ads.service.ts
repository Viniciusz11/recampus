import { api } from '@/services/api';
import type { Ad, AdFiltersState, AdStatus, AdType, Category } from '@/types/ad';
import type { PaginatedResult } from '@/types/pagination';

export interface ListAdsParams extends AdFiltersState {
  page?: number;
  limit?: number;
}

export interface AdPayload {
  title: string;
  description: string;
  category: Category;
  type: AdType;
  price?: number;
  imageUrl: string;
}

export type UpdateAdPayload = Partial<AdPayload> & { status?: AdStatus };

export async function listAds(params: ListAdsParams = {}): Promise<PaginatedResult<Ad>> {
  const { data } = await api.get<PaginatedResult<Ad>>('/ads', { params });
  return data;
}

export async function getAd(id: string): Promise<Ad> {
  const { data } = await api.get<{ ad: Ad }>(`/ads/${id}`);
  return data.ad;
}

export async function createAd(payload: AdPayload): Promise<Ad> {
  const { data } = await api.post<{ ad: Ad }>('/ads', payload);
  return data.ad;
}

export async function updateAd(id: string, payload: UpdateAdPayload): Promise<Ad> {
  const { data } = await api.put<{ ad: Ad }>(`/ads/${id}`, payload);
  return data.ad;
}

export async function deleteAd(id: string): Promise<void> {
  await api.delete(`/ads/${id}`);
}

export async function listMyAds(
  params: { status?: AdStatus; page?: number; limit?: number } = {},
): Promise<PaginatedResult<Ad>> {
  const { data } = await api.get<PaginatedResult<Ad>>('/my-ads', { params });
  return data;
}
