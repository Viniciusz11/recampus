import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AdForm, type AdFormValues } from '@/components/ads/AdForm';
import { ErrorState } from '@/components/common/ErrorState';
import { Skeleton } from '@/components/common/Skeleton';
import { useUpdateAdMutation } from '@/hooks/useAdMutations';
import { useAdQuery } from '@/hooks/useAds';
import { useAuth } from '@/hooks/useAuth';
import { getErrorMessage } from '@/utils/errors';

export function EditAdPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: ad, isLoading, isError, refetch } = useAdQuery(id);
  const updateAdMutation = useUpdateAdMutation();

  useEffect(() => {
    if (ad && user && ad.ownerId !== user.id) {
      toast.error('Você não pode editar um anúncio que não é seu.');
      navigate('/app/meus-anuncios', { replace: true });
    }
  }, [ad, user, navigate]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl">
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="mt-6 h-64 w-full" />
      </div>
    );
  }

  if (isError || !ad || !id) {
    return (
      <ErrorState message="Não foi possível carregar este anúncio." onRetry={() => void refetch()} />
    );
  }

  async function handleSubmit(values: AdFormValues): Promise<void> {
    // Mesmo motivo do guard em AdDetailPage: o estreitamento de `id` do
    // guard lá em cima não alcança esta função aninhada.
    if (!id) return;
    try {
      await updateAdMutation.mutateAsync({
        id,
        payload: {
          title: values.title,
          description: values.description,
          category: values.category,
          type: values.type,
          price: values.type === 'SALE' ? Number(values.price) : undefined,
          imageUrl: values.imageUrl,
        },
      });
      toast.success('Anúncio atualizado!');
      navigate(`/anuncios/${id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-foreground">Editar anúncio</h1>
      <div className="mt-8">
        <AdForm
          defaultValues={{
            title: ad.title,
            description: ad.description,
            category: ad.category,
            type: ad.type,
            price: ad.price ?? undefined,
            imageUrl: ad.imageUrl,
          }}
          onSubmit={handleSubmit}
          isSubmitting={updateAdMutation.isPending}
          submitLabel="Salvar alterações"
        />
      </div>
    </div>
  );
}
