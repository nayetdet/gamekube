'use client';

import { usePathname } from 'next/navigation';
import { findActiveItem } from '@/config/navigation';

export function TopBarTitle() {
  const active = findActiveItem(usePathname());
  if (!active) return null;

  return (
    <p className="hidden min-w-0 items-baseline gap-2 lg:flex">
      <span className="truncate text-sm font-bold">{active.label}</span>
      <span className="truncate text-xs text-muted-foreground">
        {active.description}
      </span>
    </p>
  );
}
