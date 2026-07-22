import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdGrid } from '@/components/ads/AdGrid';
import { useAdsQuery } from '@/hooks/useAds';

export function LatestAdsShowcase() {
  const { data, isLoading, isError, refetch } = useAdsQuery({ page: 1, limit: 8 });

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">Últimos anúncios</h2>
          <p className="mt-3 text-muted-foreground">O que a comunidade acabou de disponibilizar.</p>
        </div>
        <Link
          to="/anuncios"
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <AdGrid
        ads={data?.data}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => void refetch()}
        emptyTitle="Ainda não há anúncios"
        emptyDescription="Seja o primeiro a anunciar um item para a comunidade."
      />
    </section>
  );
}
