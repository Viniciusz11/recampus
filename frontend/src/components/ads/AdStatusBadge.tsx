import { cva } from 'class-variance-authority';
import type { AdStatus } from '@/types/ad';
import { AD_STATUS_LABELS } from '@/utils/adMeta';
import { cn } from '@/utils/cn';

const badgeVariants = cva('rounded-full px-2.5 py-1 text-xs font-medium', {
  variants: {
    status: {
      ACTIVE: 'bg-success/15 text-success',
      RESERVED: 'bg-warning/15 text-warning',
      SOLD: 'bg-muted text-muted-foreground',
    },
  },
});

export function AdStatusBadge({ status }: { status: AdStatus }) {
  return <span className={cn(badgeVariants({ status }))}>{AD_STATUS_LABELS[status]}</span>;
}
