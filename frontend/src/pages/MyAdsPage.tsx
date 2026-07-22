import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AdGrid } from '@/components/ads/AdGrid';
import { Button } from '@/components/common/Button';
import { Chip } from '@/components/common/Chip';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Pagination } from '@/components/common/Pagination';
import { useDeleteAdMutation } from '@/hooks/useAdMutations';
import { useMyAdsQuery } from '@/hooks/useAds';
import type { Ad, AdStatus } from '@/types/ad';
import { AD_STATUS_LABELS } from '@/utils/adMeta';
import { getErrorMessage } from '@/utils/errors';

interface StatusTab {
  value: AdStatus | 'ALL';
  label: string;
}

const STATUS_TABS: StatusTab[] = [
  { value: 'ALL', label: 'Todos' },
  { value: 'ACTIVE', label: AD_STATUS_LABELS.ACTIVE },
  { value: 'RESERVED', label: AD_STATUS_LABELS.RESERVED },
  { value: 'SOLD', label: AD_STATUS_LABELS.SOLD },
];

const PAGE_SIZE = 12;

export function MyAdsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<AdStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [adToDelete, setAdToDelete] = useState<Ad | null>(null);
  const deleteAdMutation = useDeleteAdMutation();

  const { data, isLoading, isError, refetch } = useMyAdsQuery({
    status: status === 'ALL' ? undefined : status,
    page,
    limit: PAGE_SIZE,
  });

  async function handleConfirmDelete(): Promise<void> {
    if (!adToDelete) return;
    try {
      await deleteAdMutation.mutateAsync(adToDelete.id);
      toast.success('Anúncio excluído.');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setAdToDelete(null);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus anúncios</h1>
          <p className="mt-1 text-muted-foreground">Gerencie o que você anunciou.</p>
        </div>
        <Button onClick={() => navigate('/app/anuncios/novo')}>Novo anúncio</Button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {STATUS_TABS.map((tab) => (
          <Chip
            key={tab.value}
            active={status === tab.value}
            onClick={() => {
              setStatus(tab.value);
              setPage(1);
            }}
          >
            {tab.label}
          </Chip>
        ))}
      </div>

      <div className="mt-6">
        <AdGrid
          ads={data?.data}
          isLoading={isLoading}
          isError={isError}
          onRetry={() => void refetch()}
          showStatus
          emptyTitle="Você ainda não tem anúncios"
          emptyDescription="Que tal anunciar o primeiro item?"
          renderActions={(ad) => (
            <>
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => navigate(`/app/anuncios/${ad.id}/editar`)}
              >
                <Pencil className="h-3.5 w-3.5" aria-hidden="true" /> Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                onClick={() => setAdToDelete(ad)}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" /> Excluir
              </Button>
            </>
          )}
        />
      </div>

      {data && data.meta.totalPages > 1 && (
        <Pagination page={page} totalPages={data.meta.totalPages} onChange={setPage} />
      )}

      <ConfirmDialog
        isOpen={Boolean(adToDelete)}
        onClose={() => setAdToDelete(null)}
        onConfirm={() => void handleConfirmDelete()}
        title="Excluir anúncio"
        message={`Tem certeza que deseja excluir "${adToDelete?.title}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteAdMutation.isPending}
      />
    </div>
  );
}
