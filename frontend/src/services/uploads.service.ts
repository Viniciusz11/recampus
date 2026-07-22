import { api } from '@/services/api';

export async function uploadAdImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const { data } = await api.post<{ url: string }>('/uploads/image', formData);
  return data.url;
}
