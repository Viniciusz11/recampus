import { Search } from 'lucide-react';
import { Input } from '@/components/common/Input';
import type { AdFiltersState, Category } from '@/types/ad';
import { CATEGORY_META } from '@/utils/adMeta';
import { cn } from '@/utils/cn';

interface AdFiltersBarProps {
  filters: AdFiltersState;
  onChange: (filters: AdFiltersState) => void;
  showSearch?: boolean;
}

const CATEGORY_ENTRIES = Object.entries(CATEGORY_META) as Array<
  [Category, (typeof CATEGORY_META)[Category]]
>;

export function AdFiltersBar({ filters, onChange, showSearch = true }: AdFiltersBarProps) {
  function toggleCategory(category: Category): void {
    onChange({ ...filters, category: filters.category === category ? undefined : category });
  }

  return (
    <div className="flex flex-col gap-4">
      {showSearch && (
        <div className="relative max-w-md">
          <Search
            className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            className="pl-9"
            placeholder="Buscar por título ou descrição..."
            aria-label="Buscar anúncios"
            value={filters.q ?? ''}
            onChange={(event) => onChange({ ...filters, q: event.target.value || undefined })}
          />
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange({ ...filters, category: undefined })}
          className={cn(
            'rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
            !filters.category
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:bg-muted',
          )}
        >
          Todas
        </button>
        {CATEGORY_ENTRIES.map(([category, meta]) => {
          const Icon = meta.icon;
          const isActive = filters.category === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => toggleCategory(category)}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-muted-foreground hover:bg-muted',
              )}
            >
              <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              {meta.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
