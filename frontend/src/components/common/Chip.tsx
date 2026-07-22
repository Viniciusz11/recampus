import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  icon?: ReactNode;
}

/** Botão-pílula com estado ativo/inativo - usado nos filtros de categoria
 * (AdFiltersBar) e nas abas de status ("Meus anúncios"). Mesmo visual, dois
 * lugares diferentes; extraído pra não repetir a mesma string de classes. */
export function Chip({ active, icon, className, children, ...props }: ChipProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border text-muted-foreground hover:bg-muted',
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
