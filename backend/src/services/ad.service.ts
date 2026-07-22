import { AdType, type Ad } from '@prisma/client';
import type { AdFilters, AdRepository, UpdateAdData } from '@/repositories/ad.repository';
import type { CreateAdInput, UpdateAdInput } from '@/schemas/ad.schemas';
import { AppError } from '@/utils/AppError';
import { buildPaginatedResult, type PaginatedResult } from '@/utils/pagination';

export interface ListAdsParams {
  filters: AdFilters;
  page: number;
  limit: number;
}

/**
 * Regra de negócio "doação não tem preço, venda exige preço > 0" - fica
 * aqui (não em Zod, não em CHECK constraint) porque no update ela depende
 * do estado atual do anúncio combinado com o que veio na requisição, não
 * só do shape do payload isoladamente.
 */
function assertValidPricing(type: AdType, price: number | null): void {
  if (type === AdType.DONATION && price !== null) {
    throw new AppError('Anúncios de doação não podem ter preço', 400, 'INVALID_PRICING');
  }
  if (type === AdType.SALE && (price === null || price <= 0)) {
    throw new AppError('Anúncios de venda precisam de um preço maior que zero', 400, 'INVALID_PRICING');
  }
}

export class AdService {
  constructor(private readonly adRepository: AdRepository) {}

  async list({ filters, page, limit }: ListAdsParams): Promise<PaginatedResult<Ad>> {
    const { items, total } = await this.adRepository.findMany({
      filters,
      skip: (page - 1) * limit,
      take: limit,
    });

    return buildPaginatedResult(items, total, { page, limit });
  }

  async getById(id: string): Promise<Ad> {
    const ad = await this.adRepository.findById(id);
    if (!ad) throw AppError.notFound('Anúncio não encontrado');
    return ad;
  }

  async create(ownerId: string, input: CreateAdInput): Promise<Ad> {
    const price = input.price ?? null;
    assertValidPricing(input.type, price);

    return this.adRepository.create({
      title: input.title,
      description: input.description,
      category: input.category,
      type: input.type,
      price,
      imageUrl: input.imageUrl,
      ownerId,
    });
  }

  async update(id: string, ownerId: string, input: UpdateAdInput): Promise<Ad> {
    const ad = await this.getById(id);
    this.assertOwnership(ad, ownerId);

    const nextType = input.type ?? ad.type;
    const nextPrice =
      nextType === AdType.DONATION
        ? null
        : (input.price ?? (ad.price !== null ? ad.price.toNumber() : null));

    assertValidPricing(nextType, nextPrice);

    const data: UpdateAdData = { ...input, price: nextPrice };
    return this.adRepository.update(id, data);
  }

  async delete(id: string, ownerId: string): Promise<void> {
    const ad = await this.getById(id);
    this.assertOwnership(ad, ownerId);
    await this.adRepository.delete(id);
  }

  private assertOwnership(ad: Ad, ownerId: string): void {
    if (ad.ownerId !== ownerId) {
      throw AppError.forbidden('Você não tem permissão para alterar este anúncio');
    }
  }
}
