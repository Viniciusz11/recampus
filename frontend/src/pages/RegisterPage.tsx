import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RegisterForm, type RegisterFormValues } from '@/components/auth/RegisterForm';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errors';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: RegisterFormValues): Promise<void> {
    setIsSubmitting(true);
    try {
      await register(values.name, values.email, values.password);
      toast.success('Conta criada! Bem-vindo(a) ao ReCampus.');
      navigate('/app', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, 'Não foi possível criar sua conta.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Criar conta</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Cadastre-se para anunciar itens e ajudar outros estudantes.
      </p>
      <div className="mt-8">
        <RegisterForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
