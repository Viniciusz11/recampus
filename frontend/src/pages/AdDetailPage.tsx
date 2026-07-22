import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AdStatusBadge } from '@/components/ads/AdStatusBadge';
import { Button } from '@/components/common/Button';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/common/Skeleton';
import { useDeleteAdMutation } from '@/hooks/useAdMutations';
import { useAdQuery } from '@/hooks/useAds';
import { useAuth } from '@/hooks/useAuth';
import { AD_TYPE_LABELS, CATEGORY_META } from '@/utils/adMeta';
import { getErrorMessage } from '@/utils/errors';
import { formatDate, formatPrice } from '@/utils/format';

export function AdDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: ad, isLoading, isError, refetch } = useAdQuery(id);
  const deleteAdMutation = useDeleteAdMutation();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="mt-6 h-8 w-2/3" />
        <Skeleton className="mt-3 h-4 w-1/3" />
      </div>
    );
  }

  if (isError || !ad) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <ErrorState message="Não foi possível carregar este anúncio." onRetry={() => void refetch()} />
      </div>
    );
  }

  const categoryMeta = CATEGORY_META[ad.category];
  const CategoryIcon = categoryMeta.icon;
  const isOwner = user?.id === ad.ownerId;

  async function handleDelete(): Promise<void> {
    // Re-checar aqui (não só no guard lá em cima): TS não propaga
    // estreitamento de tipo de fora para dentro de uma função aninhada.
    if (!ad) return;
    try {
      await deleteAdMutation.mutateAsync(ad.id);
      toast.success('Anúncio excluído.');
      navigate('/app/meus-anuncios');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsConfirmOpen(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        to="/anuncios"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar para anúncios
      </Link>

      <div className="overflow-hidden rounded-xl border border-border">
        <img src={ad.imageUrl} alt={ad.title} className="aspect-video w-full object-cover" />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <CategoryIcon className="h-4 w-4" aria-hidden="true" /> {categoryMeta.label}
        </span>
        <AdStatusBadge status={ad.status} />
      </div>

      <h1 className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">{ad.title}</h1>

      <p
        className={
          ad.type === 'DONATION'
            ? 'mt-2 text-2xl font-bold text-secondary'
            : 'mt-2 text-2xl font-bold text-primary'
        }
      >
        {formatPrice(ad.price)}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({AD_TYPE_LABELS[ad.type]})
        </span>
      </p>

      <p className="mt-6 whitespace-pre-line text-foreground">{ad.description}</p>

      <div className="mt-8 rounded-xl border border-border p-4 text-sm text-muted-foreground">
        Anunciado por <span className="font-medium text-foreground">{ad.owner.name}</span> em{' '}
        {formatDate(ad.createdAt)}
      </div>

      {isOwner && (
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/app/anuncios/${ad.id}/editar`)}>
            <Pencil className="h-4 w-4" aria-hidden="true" /> Editar
          </Button>
          <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Excluir
          </Button>
        </div>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => void handleDelete()}
        title="Excluir anúncio"
        message={`Tem certeza que deseja excluir "${ad.title}"? Essa ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={deleteAdMutation.isPending}
      />
    </div>
  );
}
