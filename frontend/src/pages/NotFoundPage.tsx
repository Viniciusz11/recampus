import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-7xl font-bold text-primary">404</p>
      <h1 className="text-2xl font-bold text-foreground">Página não encontrada</h1>
      <p className="max-w-sm text-muted-foreground">
        O link que você seguiu pode estar quebrado, ou a página pode ter sido removida.
      </p>
      <Link to="/">
        <Button>
          <Home className="h-4 w-4" aria-hidden="true" /> Voltar para o início
        </Button>
      </Link>
    </div>
  );
}
