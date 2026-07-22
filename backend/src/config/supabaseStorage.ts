import { createClient } from '@supabase/supabase-js';
import { env } from '@/config/env';

/**
 * Client server-only, autenticado com a service_role key - tem permissão
 * total no Storage e ignora Row Level Security. Nunca deve ser exposto ao
 * frontend (por isso vive só aqui, junto do resto da config de backend).
 */
export const supabaseStorage = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
}).storage;
