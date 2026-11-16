import { cn } from '@/lib/utils';
import { site } from '@/config/site';

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="170 175 430 410"
      role="img"
      aria-label={site.name}
      className={cn('size-10 shrink-0', className)}
    >
      <image href="/gamekube-brand-blue.png" width="2172" height="724" />
    </svg>
  );
}
