import { Search } from 'lucide-react';
import { Chip } from '@/components/common/Chip';
import { Input } from '@/components/common/Input';
import type { AdFiltersState, Category } from '@/types/ad';
import { CATEGORY_META } from '@/utils/adMeta';

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
        <Chip active={!filters.category} onClick={() => onChange({ ...filters, category: undefined })}>
          Todas
        </Chip>
        {CATEGORY_ENTRIES.map(([category, meta]) => {
          const Icon = meta.icon;
          return (
            <Chip
              key={category}
              active={filters.category === category}
              icon={<Icon className="h-3.5 w-3.5" aria-hidden="true" />}
              onClick={() => toggleCategory(category)}
            >
              {meta.label}
            </Chip>
          );
        })}
      </div>
    </div>
  );
}
