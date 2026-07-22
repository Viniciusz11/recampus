import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Não foi possível carregar os dados.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-danger/40 px-6 py-16 text-center">
      <AlertTriangle className="h-10 w-10 text-danger" aria-hidden="true" />
      <p className="font-medium text-foreground">Algo deu errado</p>
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Tentar de novo
        </Button>
      )}
    </div>
  );
}
