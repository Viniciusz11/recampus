import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

const registerFormSchema = z
  .object({
    name: z.string().trim().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100),
    email: z.string().trim().email('E-mail inválido'),
    phone: z
      .string()
      .trim()
      .transform((value) => value.replace(/\D/g, ''))
      .pipe(z.string().regex(/^\d{10,11}$/, 'Informe um telefone válido com DDD')),
    password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

interface RegisterFormProps {
  onSubmit: (values: RegisterFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function RegisterForm({ onSubmit, isSubmitting = false }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormSchema) });

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="flex flex-col gap-4">
      <Input
        label="Nome"
        autoComplete="name"
        placeholder="Como podemos te chamar?"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="E-mail"
        type="email"
        autoComplete="email"
        placeholder="voce@universidade.edu"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label="WhatsApp"
        type="tel"
        autoComplete="tel"
        placeholder="(85) 99999-9999"
        error={errors.phone?.message}
        {...register('phone')}
      />
      <Input
        label="Senha"
        type="password"
        autoComplete="new-password"
        placeholder="Pelo menos 8 caracteres"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        label="Confirmar senha"
        type="password"
        autoComplete="new-password"
        placeholder="Repita a senha"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Criar conta
      </Button>
    </form>
  );
}
