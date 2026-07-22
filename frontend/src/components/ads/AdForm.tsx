import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Textarea } from '@/components/common/Textarea';
import { AD_TYPES, CATEGORIES } from '@/types/ad';
import { AD_TYPE_LABELS, CATEGORY_META } from '@/utils/adMeta';

const adFormSchema = z
  .object({
    title: z.string().trim().min(3, 'Título deve ter pelo menos 3 caracteres').max(120),
    description: z
      .string()
      .trim()
      .min(10, 'Descrição deve ter pelo menos 10 caracteres')
      .max(2000),
    category: z.enum(CATEGORIES, { message: 'Escolha uma categoria' }),
    type: z.enum(AD_TYPES, { message: 'Escolha o tipo de anúncio' }),
    price: z.string().optional(),
    imageUrl: z.string().trim().url('Informe uma URL de imagem válida'),
  })
  .superRefine((data, ctx) => {
    if (data.type === 'SALE') {
      const priceValue = Number(data.price);
      if (!data.price || Number.isNaN(priceValue) || priceValue <= 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['price'],
          message: 'Informe um preço maior que zero para anúncios de venda',
        });
      }
    }
  });

export type AdFormValues = z.infer<typeof adFormSchema>;

interface AdFormProps {
  defaultValues?: Partial<AdFormValues>;
  onSubmit: (values: AdFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function AdForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Publicar anúncio',
}: AdFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AdFormValues>({
    resolver: zodResolver(adFormSchema),
    defaultValues: { type: 'SALE', ...defaultValues },
  });

  // useWatch (não o `watch()` retornado por useForm) porque `watch` devolve
  // uma função que não pode ser memoizada com segurança pelo React Compiler.
  const type = useWatch({ control, name: 'type' });

  return (
    <form onSubmit={(event) => void handleSubmit(onSubmit)(event)} className="flex flex-col gap-4">
      <Input
        label="Título"
        placeholder="Ex: Calculadora científica HP 12C"
        error={errors.title?.message}
        {...register('title')}
      />
      <Textarea
        label="Descrição"
        placeholder="Conte o estado do item, se tem algum detalhe importante..."
        error={errors.description?.message}
        {...register('description')}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Select
          label="Categoria"
          placeholder="Selecione a categoria"
          error={errors.category?.message}
          options={CATEGORIES.map((category) => ({
            value: category,
            label: CATEGORY_META[category].label,
          }))}
          {...register('category')}
        />
        <Select
          label="Tipo de anúncio"
          error={errors.type?.message}
          options={AD_TYPES.map((adType) => ({ value: adType, label: AD_TYPE_LABELS[adType] }))}
          {...register('type')}
        />
      </div>
      {type === 'SALE' && (
        <Input
          label="Preço (R$)"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="0,00"
          error={errors.price?.message}
          {...register('price')}
        />
      )}
      <Input
        label="URL da imagem"
        placeholder="https://..."
        error={errors.imageUrl?.message}
        {...register('imageUrl')}
      />
      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        {submitLabel}
      </Button>
    </form>
  );
}
