import { AlertTriangle } from 'lucide-react';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/common/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Única classe do projeto: React ainda não tem equivalente via hooks para
 * capturar erros de renderização (getDerivedStateFromError/componentDidCatch
 * não existem como hook). Sem isso, um erro inesperado em qualquer
 * componente filho derruba a árvore inteira para uma tela branca sem
 * recuperação - este é o último cinto de segurança antes disso acontecer.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Erro não tratado capturado pelo ErrorBoundary:', error, errorInfo);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
          <AlertTriangle className="h-12 w-12 text-danger" aria-hidden="true" />
          <h1 className="text-xl font-bold text-foreground">Algo deu errado</h1>
          <p className="max-w-sm text-muted-foreground">
            Encontramos um erro inesperado. Tente recarregar a página.
          </p>
          <Button onClick={() => window.location.reload()}>Recarregar</Button>
        </div>
      );
    }

    return this.props.children;
  }
}
