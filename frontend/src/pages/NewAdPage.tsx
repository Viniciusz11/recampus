import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AdForm, type AdFormValues } from '@/components/ads/AdForm';
import { useCreateAdMutation } from '@/hooks/useAdMutations';
import { getErrorMessage } from '@/utils/errors';

export function NewAdPage() {
  const navigate = useNavigate();
  const createAdMutation = useCreateAdMutation();

  async function handleSubmit(values: AdFormValues): Promise<void> {
    try {
      const ad = await createAdMutation.mutateAsync({
        title: values.title,
        description: values.description,
        category: values.category,
        type: values.type,
        price: values.type === 'SALE' ? Number(values.price) : undefined,
        imageUrl: values.imageUrl,
      });
      toast.success('Anúncio publicado!');
      navigate(`/anuncios/${ad.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-2xl font-bold text-foreground">Anunciar item</h1>
      <p className="mt-2 text-muted-foreground">
        Preencha os dados abaixo. Itens de doação não precisam de preço.
      </p>
      <div className="mt-8">
        <AdForm onSubmit={handleSubmit} isSubmitting={createAdMutation.isPending} />
      </div>
    </div>
  );
}
