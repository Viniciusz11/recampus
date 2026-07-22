import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAd,
  deleteAd,
  updateAd,
  type AdPayload,
  type UpdateAdPayload,
} from '@/services/ads.service';

function useInvalidateAdQueries() {
  const queryClient = useQueryClient();
  return (): void => {
    void queryClient.invalidateQueries({ queryKey: ['ads'] });
    void queryClient.invalidateQueries({ queryKey: ['my-ads'] });
  };
}

export function useCreateAdMutation() {
  const invalidate = useInvalidateAdQueries();
  return useMutation({
    mutationFn: (payload: AdPayload) => createAd(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateAdMutation() {
  const invalidate = useInvalidateAdQueries();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateAdPayload }) => updateAd(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteAdMutation() {
  const invalidate = useInvalidateAdQueries();
  return useMutation({
    mutationFn: (id: string) => deleteAd(id),
    onSuccess: invalidate,
  });
}
