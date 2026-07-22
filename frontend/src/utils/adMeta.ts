import {
  BookOpen,
  Calculator,
  Copy,
  Cpu,
  FlaskConical,
  Package,
  Shirt,
  Sofa,
  type LucideIcon,
} from 'lucide-react';
import type { AdStatus, AdType, Category } from '@/types/ad';

interface CategoryMeta {
  label: string;
  icon: LucideIcon;
}

export const CATEGORY_META: Record<Category, CategoryMeta> = {
  BOOKS: { label: 'Livros', icon: BookOpen },
  CALCULATORS: { label: 'Calculadoras', icon: Calculator },
  ELECTRONICS: { label: 'Eletrônicos', icon: Cpu },
  LAB_COATS: { label: 'Jalecos', icon: Shirt },
  FURNITURE: { label: 'Móveis', icon: Sofa },
  PHOTOCOPIES: { label: 'Xerox', icon: Copy },
  LAB_MATERIALS: { label: 'Materiais de Lab.', icon: FlaskConical },
  OTHER: { label: 'Outros', icon: Package },
};

export const AD_TYPE_LABELS: Record<AdType, string> = {
  DONATION: 'Doação',
  SALE: 'Venda',
};

export const AD_STATUS_LABELS: Record<AdStatus, string> = {
  ACTIVE: 'Disponível',
  RESERVED: 'Reservado',
  SOLD: 'Vendido',
};
