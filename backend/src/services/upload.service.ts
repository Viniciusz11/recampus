import { randomUUID } from 'node:crypto';
import { env } from '@/config/env';
import type { supabaseStorage } from '@/config/supabaseStorage';
import { AppError } from '@/utils/AppError';

export class UploadService {
  constructor(private readonly storage: typeof supabaseStorage) {}

  async uploadAdImage(file: Buffer): Promise<string> {
    const path = `${randomUUID()}.png`;

    const { error } = await this.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .upload(path, file, { contentType: 'image/png' });

    if (error) throw new AppError(`Falha ao enviar imagem: ${error.message}`, 502, 'UPLOAD_FAILED');

    const { data } = this.storage.from(env.SUPABASE_STORAGE_BUCKET).getPublicUrl(path);
    return data.publicUrl;
  }
}
