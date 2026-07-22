import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/utils/format';

export function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  async function handleLogout(): Promise<void> {
    // Sem navigate() manual aqui de propósito: assim que user vira null,
    // o ProtectedRoute (que já envolve /app/perfil) redireciona sozinho
    // pra /login. Chamar navigate('/') aqui também cria uma corrida real
    // entre duas atualizações de rota concorrentes - o resultado final
    // dependia de timing (às vezes ficava em "/", às vezes voltava pra
    // "/login" mesmo com o navigate rodando primeiro). Uma fonte de
    // verdade só é mais simples e sempre previsível.
    await logout();
    toast.success('Você saiu da sua conta.');
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-foreground">Perfil</h1>

      <div className="mt-8 flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-semibold text-foreground">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
        <p className="text-xs text-muted-foreground">Membro desde {formatDate(user.createdAt)}</p>
      </div>

      <Button variant="outline" className="mt-6 w-full" onClick={() => void handleLogout()}>
        <LogOut className="h-4 w-4" aria-hidden="true" /> Sair da conta
      </Button>
    </div>
  );
}
