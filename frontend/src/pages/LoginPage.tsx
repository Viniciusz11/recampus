import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LoginForm, type LoginFormValues } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errors';

interface LocationState {
  from?: { pathname: string };
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(values: LoginFormValues): Promise<void> {
    setIsSubmitting(true);
    try {
      await login(values.email, values.password);
      toast.success('Login realizado com sucesso!');
      const state = location.state as LocationState | null;
      navigate(state?.from?.pathname ?? '/app', { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, 'E-mail ou senha inválidos.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Entrar</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Acesse sua conta para anunciar e gerenciar seus itens.
      </p>
      <div className="mt-8">
        <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ainda não tem conta?{' '}
        <Link to="/cadastro" className="font-medium text-primary hover:underline">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
