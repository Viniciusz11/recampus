import { z } from 'zod';

/// DDD (2 dígitos) + número (8 ou 9 dígitos) - só o Brasil é suportado por
/// enquanto, então o "55" do WhatsApp é adicionado na hora de montar o link,
/// não guardado aqui.
export const phoneSchema = z
  .string()
  .trim()
  .transform((value) => value.replace(/\D/g, ''))
  .pipe(z.string().regex(/^\d{10,11}$/, 'Informe um telefone válido com DDD'));

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').max(72),
  phone: phoneSchema,
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('E-mail inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});
export type LoginInput = z.infer<typeof loginSchema>;
