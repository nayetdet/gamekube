import Link from 'next/link';
import { routes } from '@/config/routes';
import { site } from '@/config/site';
import { BrandLockup } from './brand-lockup';

export function SidebarBrand() {
  return (
    <Link
      href={routes.dashboard}
      aria-label={site.name}
      className="flex justify-center rounded-xl px-2 py-2 transition-colors hover:bg-sidebar-accent"
    >
      <BrandLockup className="w-28" />
    </Link>
  );
}
