import Image from 'next/image';
import { cn } from '@/lib/utils';
import { site } from '@/config/site';

export function BrandLockup({ className }: { className?: string }) {
  return (
    <span className={cn('relative block w-36', className)}>
      <Image
        src="/gamekube-brand-blue.png"
        alt={site.name}
        width={640}
        height={498}
        priority
        className="h-auto w-full object-contain"
      />
      <Image
        src="/gamekube-brand-blue.png"
        alt=""
        aria-hidden
        width={640}
        height={498}
        className="absolute inset-0 hidden h-auto w-full object-contain invert dark:block"
        style={{ clipPath: 'inset(90% 0 0 0)' }}
      />
    </span>
  );
}
