import { Recycle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-10 text-center sm:flex-row sm:justify-between sm:px-6 sm:text-left">
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Recycle className="h-5 w-5 text-primary" aria-hidden="true" />
          ReCampus
        </div>
        <p className="text-sm text-muted-foreground">
          Projeto desenvolvido para o processo seletivo do Laboratório Vortex (UNIFOR), 2026.
        </p>
      </div>
    </footer>
  );
}
