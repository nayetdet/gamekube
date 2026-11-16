import Link from 'next/link';
import type { NavItem } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { routes } from '@/config/routes';
import { UnreadBadge } from '@/components/message/unread-badge';

type SidebarNavLinkProps = {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
  unreadCount: number;
  requestCount: number;
  compact?: boolean;
};

export function SidebarNavLink({
  item,
  active,
  onNavigate,
  unreadCount,
  requestCount,
  compact = false,
}: SidebarNavLinkProps) {
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={item.description}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-4 rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
        compact && 'justify-center',
        active
          ? 'bg-sidebar-accent text-sidebar-accent-foreground'
          : 'text-sidebar-foreground hover:bg-card hover:text-foreground',
      )}
    >
      <span className="relative shrink-0">
        <Icon
          className={cn(
            'size-4.5 shrink-0 transition-colors',
            active ? 'text-brand-700' : 'text-foreground/55',
          )}
          aria-hidden
        />
        {((item.href === routes.messages && unreadCount > 0) ||
          (item.href === routes.friendRequests && requestCount > 0)) && (
          <span className="absolute -top-2 -right-3">
            <UnreadBadge
              count={item.href === routes.messages ? unreadCount : requestCount}
              label={
                item.href === routes.friendRequests
                  ? 'pedido de amizade'
                  : undefined
              }
            />
          </span>
        )}
      </span>
      <span className={compact ? 'sr-only' : 'truncate'}>{item.label}</span>
    </Link>
  );
}
