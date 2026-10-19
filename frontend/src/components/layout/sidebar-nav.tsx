'use client';

import { usePathname } from 'next/navigation';
import { findActiveItem, navigation } from '@/config/navigation';
import { SidebarNavLink } from './sidebar-nav-link';

type SidebarNavProps = {
  canSeeAdmin: boolean;
  onNavigate?: () => void;
};

export function SidebarNav({ canSeeAdmin, onNavigate }: SidebarNavProps) {
  const active = findActiveItem(usePathname());

  return (
    <nav className="flex flex-col gap-6" aria-label="Principal">
      {navigation.map((group) => {
        const items = group.items.filter(
          (item) => canSeeAdmin || !item.adminOnly,
        );
        if (items.length === 0) return null;

        return (
          <div key={group.label} className="space-y-1">
            <p className="px-3 pb-1 text-[0.68rem] font-bold tracking-[0.14em] text-foreground/55 uppercase">
              {group.label}
            </p>
            {items.map((item) => (
              <SidebarNavLink
                key={item.href}
                item={item}
                active={item.href === active?.href}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        );
      })}
    </nav>
  );
}
