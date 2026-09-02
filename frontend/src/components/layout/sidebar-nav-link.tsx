import Link from 'next/link';
import type { NavItem } from '@/config/navigation';
import { cn } from '@/lib/utils';

type SidebarNavLinkProps = {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
};

export function SidebarNavLink({
  item,
  active,
  onNavigate,
}: SidebarNavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={item.description}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-card hover:text-foreground',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-600 transition-opacity',
          active ? 'opacity-100' : 'opacity-0',
        )}
      />
      <Icon
        className={cn(
          'size-4.5 shrink-0 transition-colors',
          active ? 'text-brand-700' : 'text-foreground/55',
        )}
        aria-hidden
      />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}
