import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AdStatusBadge } from '@/components/ads/AdStatusBadge';
import type { Ad } from '@/types/ad';
import { AD_TYPE_LABELS, CATEGORY_META } from '@/utils/adMeta';
import { formatPrice } from '@/utils/format';

interface AdCardProps {
  ad: Ad;
  showStatus?: boolean;
  /** Botões extras (editar/excluir) - ficam fora do <Link> pra não aninhar interativos. */
  actions?: ReactNode;
}

export function AdCard({ ad, showStatus = false, actions }: AdCardProps) {
  const categoryMeta = CATEGORY_META[ad.category];
  const CategoryIcon = categoryMeta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background transition-shadow hover:shadow-lg">
        <Link to={`/anuncios/${ad.id}`} className="group flex flex-1 flex-col">
          <div className="relative aspect-4/3 overflow-hidden bg-muted">
            <img
              src={ad.imageUrl}
              alt={ad.title}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            {showStatus && (
              <div className="absolute top-2 right-2">
                <AdStatusBadge status={ad.status} />
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col gap-2 p-4">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CategoryIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {categoryMeta.label}
            </div>
            <h3 className="line-clamp-2 font-semibold text-foreground">{ad.title}</h3>
            <div className="mt-auto flex items-center justify-between pt-2">
              <span
                className={
                  ad.type === 'DONATION'
                    ? 'text-sm font-semibold text-secondary'
                    : 'text-sm font-semibold text-primary'
                }
              >
                {formatPrice(ad.price)}
              </span>
              <span className="text-xs text-muted-foreground">{AD_TYPE_LABELS[ad.type]}</span>
            </div>
          </div>
        </Link>
        {actions && <div className="flex gap-2 border-t border-border p-3">{actions}</div>}
      </div>
    </motion.div>
  );
}
