import { useQuery } from '@tanstack/react-query';
import { getAd, listAds, listMyAds, type ListAdsParams } from '@/services/ads.service';
import type { AdStatus } from '@/types/ad';

export function useAdsQuery(params: ListAdsParams) {
  return useQuery({
    queryKey: ['ads', params],
    queryFn: () => listAds(params),
  });
}

export function useAdQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['ads', id],
    queryFn: () => {
      if (!id) throw new Error('Ad id é obrigatório');
      return getAd(id);
    },
    enabled: Boolean(id),
  });
}

export interface MyAdsParams {
  status?: AdStatus;
  page?: number;
  limit?: number;
}

export function useMyAdsQuery(params: MyAdsParams = {}) {
  return useQuery({
    queryKey: ['my-ads', params],
    queryFn: () => listMyAds(params),
  });
}
