import Image from 'next/image';
import { cn } from '@/lib/utils';
import { site } from '@/config/site';

export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/gamekube-symbol.png"
      alt={site.name}
      width={320}
      height={360}
      priority
      className={cn('size-10 shrink-0 object-contain', className)}
    />
  );
}
