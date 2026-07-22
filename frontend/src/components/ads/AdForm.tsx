import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus } from 'lucide-react';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Select';
import { Textarea } from '@/components/common/Textarea';
import { uploadAdImage } from '@/services/uploads.service';
import { AD_TYPES, CATEGORIES } from '@/types/ad';
import { AD_TYPE_LABELS, CATEGORY_META } from '@/utils/adMeta';
import { getErrorMessage } from '@/utils/errors';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

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

type RawFormValues = z.infer<typeof adFormSchema>;

// Contrato exposto ao restante do app: sempre uma imageUrl resolvida (o
// upload, se houver arquivo novo, já aconteceu antes do onSubmit ser chamado).
export type AdFormValues = RawFormValues & { imageUrl: string };

interface AdFormProps {
  defaultValues?: Partial<RawFormValues> & { imageUrl?: string };
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
  } = useForm<RawFormValues>({
    resolver: zodResolver(adFormSchema),
    defaultValues: { type: 'SALE', ...defaultValues },
  });

  // useWatch (não o `watch()` retornado por useForm) porque `watch` devolve
  // uma função que não pode ser memoizada com segurança pelo React Compiler.
  const type = useWatch({ control, name: 'type' });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>();
  const [isUploading, setIsUploading] = useState(false);

  // useMemo (não useState+useEffect) porque a URL do blob é inteiramente
  // derivada de `imageFile` - não há estado externo pra "sincronizar", só um
  // valor computado que precisa ser liberado quando o arquivo muda.
  const previewUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : defaultValues?.imageUrl),
    [imageFile, defaultValues?.imageUrl],
  );

  useEffect(() => {
    if (!imageFile || !previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile, previewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      setImageError('A imagem precisa ser um arquivo PNG');
      event.target.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setImageError('A imagem deve ter até 5MB');
      event.target.value = '';
      return;
    }
    setImageError(undefined);
    setImageFile(file);
  }

  async function handleFormSubmit(raw: RawFormValues): Promise<void> {
    if (!imageFile && !defaultValues?.imageUrl) {
      setImageError('Selecione uma imagem para o anúncio');
      return;
    }

    let imageUrl = defaultValues?.imageUrl;
    if (imageFile) {
      setIsUploading(true);
      try {
        imageUrl = await uploadAdImage(imageFile);
      } catch (error) {
        setImageError(getErrorMessage(error, 'Falha ao enviar a imagem. Tente novamente.'));
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    await onSubmit({ ...raw, imageUrl: imageUrl as string });
  }

  const busy = isSubmitting || isUploading;

  return (
    <form onSubmit={(event) => void handleSubmit(handleFormSubmit)(event)} className="flex flex-col gap-4">
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

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-foreground">Imagem do item</span>
        <label
          className="group relative flex h-40 w-40 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-border bg-background transition-colors hover:border-primary"
        >
          <input
            type="file"
            accept="image/png"
            onChange={handleFileChange}
            disabled={busy}
            className="sr-only"
          />
          {previewUrl ? (
            <>
              <img src={previewUrl} alt="Pré-visualização do anúncio" className="h-full w-full object-cover" />
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                Trocar imagem
              </span>
            </>
          ) : (
            <span className="flex flex-col items-center gap-1.5 text-muted-foreground">
              <ImagePlus className="h-6 w-6" aria-hidden="true" />
              <span className="px-2 text-center text-xs">Selecionar PNG</span>
            </span>
          )}
        </label>
        <span className="text-xs text-muted-foreground">Arquivo PNG, até 5MB.</span>
        {imageError && <span className="text-xs text-danger">{imageError}</span>}
      </div>

      <Button type="submit" isLoading={busy} className="mt-2">
        {isUploading ? 'Enviando imagem...' : submitLabel}
      </Button>
    </form>
  );
}
