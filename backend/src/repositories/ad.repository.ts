import type { Ad, AdStatus, AdType, Category, Prisma, PrismaClient } from '@prisma/client';

export interface AdFilters {
  category?: Category;
  type?: AdType;
  status?: AdStatus;
  q?: string;
  ownerId?: string;
}

export interface FindManyParams {
  filters: AdFilters;
  skip: number;
  take: number;
}

export interface CreateAdData {
  title: string;
  description: string;
  category: Category;
  type: AdType;
  price: number | null;
  imageUrl: string;
  ownerId: string;
}

export interface UpdateAdData {
  title?: string;
  description?: string;
  category?: Category;
  type?: AdType;
  price?: number | null;
  imageUrl?: string;
  status?: AdStatus;
}

export interface AdRepository {
  findMany(params: FindManyParams): Promise<{ items: Ad[]; total: number }>;
  findById(id: string): Promise<Ad | null>;
  create(data: CreateAdData): Promise<Ad>;
  update(id: string, data: UpdateAdData): Promise<Ad>;
  delete(id: string): Promise<void>;
}

function buildWhere(filters: AdFilters): Prisma.AdWhereInput {
  const where: Prisma.AdWhereInput = {};

  if (filters.category) where.category = filters.category;
  if (filters.type) where.type = filters.type;
  if (filters.status) where.status = filters.status;
  if (filters.ownerId) where.ownerId = filters.ownerId;

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: 'insensitive' } },
      { description: { contains: filters.q, mode: 'insensitive' } },
    ];
  }

  return where;
}

export class PrismaAdRepository implements AdRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findMany({ filters, skip, take }: FindManyParams): Promise<{ items: Ad[]; total: number }> {
    const where = buildWhere(filters);

    // $transaction garante que a página de itens e o total contado batem
    // com o mesmo snapshot dos dados, mesmo sob escritas concorrentes.
    const [items, total] = await this.prisma.$transaction([
      this.prisma.ad.findMany({ where, skip, take, orderBy: { createdAt: 'desc' } }),
      this.prisma.ad.count({ where }),
    ]);

    return { items, total };
  }

  findById(id: string): Promise<Ad | null> {
    return this.prisma.ad.findUnique({ where: { id } });
  }

  create(data: CreateAdData): Promise<Ad> {
    return this.prisma.ad.create({ data });
  }

  update(id: string, data: UpdateAdData): Promise<Ad> {
    return this.prisma.ad.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.ad.delete({ where: { id } });
  }
}
