export const CATEGORIES = [
  'BOOKS',
  'CALCULATORS',
  'ELECTRONICS',
  'LAB_COATS',
  'FURNITURE',
  'PHOTOCOPIES',
  'LAB_MATERIALS',
  'OTHER',
] as const;
export type Category = (typeof CATEGORIES)[number];

export const AD_TYPES = ['DONATION', 'SALE'] as const;
export type AdType = (typeof AD_TYPES)[number];

export const AD_STATUSES = ['ACTIVE', 'RESERVED', 'SOLD'] as const;
export type AdStatus = (typeof AD_STATUSES)[number];

export interface Ad {
  id: string;
  title: string;
  description: string;
  category: Category;
  /** Prisma serializa Decimal como string em JSON - nunca chega como number. */
  price: string | null;
  type: AdType;
  imageUrl: string;
  status: AdStatus;
  ownerId: string;
  owner: { id: string; name: string; phone: string | null };
  createdAt: string;
  updatedAt: string;
}

export interface AdFiltersState {
  category?: Category;
  type?: AdType;
  status?: AdStatus;
  q?: string;
}
