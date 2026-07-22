import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AdFiltersBar } from '@/components/ads/AdFiltersBar';
import { AdGrid } from '@/components/ads/AdGrid';
import { Pagination } from '@/components/common/Pagination';
import { useAdsQuery } from '@/hooks/useAds';
import { useDebounce } from '@/hooks/useDebounce';
import { CATEGORIES, type AdFiltersState, type Category } from '@/types/ad';

const PAGE_SIZE = 12;

function parseCategoryParam(value: string | null): Category | undefined {
  return value && (CATEGORIES as readonly string[]).includes(value) ? (value as Category) : undefined;
}

export function BrowseAdsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);

  const filters: AdFiltersState = useMemo(
    () => ({
      category: parseCategoryParam(searchParams.get('category')),
      q: searchParams.get('q') ?? undefined,
    }),
    [searchParams],
  );

  const debouncedQuery = useDebounce(filters.q, 400);

  function handleFiltersChange(next: AdFiltersState): void {
    setPage(1);
    const params = new URLSearchParams();
    if (next.category) params.set('category', next.category);
    if (next.q) params.set('q', next.q);
    setSearchParams(params);
  }

  const { data, isLoading, isError, refetch } = useAdsQuery({
    category: filters.category,
    q: debouncedQuery,
    page,
    limit: PAGE_SIZE,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Anúncios</h1>
      <p className="mt-2 text-muted-foreground">Encontre livros, calculadoras, jalecos e mais.</p>

      <div className="mt-6">
        <AdFiltersBar filters={filters} onChange={handleFiltersChange} />
      </div>

      <div className="mt-8">
        <AdGrid
          ads={data?.data}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => void refetch()}
        />
      </div>

      {data && data.meta.totalPages > 1 && (
        <Pagination page={page} totalPages={data.meta.totalPages} onChange={setPage} />
      )}
    </div>
  );
}
