import Image from 'next/image';
import { cn } from '@/lib/utils';
import { site } from '@/config/site';

export function BrandLockup({ className }: { className?: string }) {
  return (
    <Image
      src="/gamekube-lockup.png"
      alt={site.name}
      width={640}
      height={498}
      priority
      className={cn('h-auto w-36 object-contain', className)}
    />
  );
}
