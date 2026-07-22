import { PackageSearch } from 'lucide-react';
import type { ReactNode } from 'react';
import { AdCard } from '@/components/ads/AdCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/common/Skeleton';
import type { Ad } from '@/types/ad';

interface AdGridProps {
  ads: Ad[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry?: () => void;
  showStatus?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  renderActions?: (ad: Ad) => ReactNode;
}

export function AdGrid({
  ads,
  isLoading,
  isError,
  onRetry,
  showStatus = false,
  emptyTitle = 'Nenhum anúncio encontrado',
  emptyDescription = 'Tente ajustar os filtros ou volte mais tarde.',
  renderActions,
}: AdGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={`ad-skeleton-${index}`} className="aspect-3/4" />
        ))}
      </div>
    );
  }

  if (isError) {
    return <ErrorState onRetry={onRetry} message="Não foi possível carregar os anúncios." />;
  }

  if (!ads || ads.length === 0) {
    return <EmptyState icon={PackageSearch} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} showStatus={showStatus} actions={renderActions?.(ad)} />
      ))}
    </div>
  );
}
