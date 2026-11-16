'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldIcon, UserRoundIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { cn } from '@/lib/utils';

const sections = [
  { href: routes.settingsAccount, label: 'Conta', icon: UserRoundIcon },
  { href: routes.settingsPrivacy, label: 'Privacidade', icon: ShieldIcon },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Seções de configurações"
      className="flex gap-1 md:flex-col"
    >
      {sections.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          aria-current={pathname === href ? 'page' : undefined}
          className={cn(
            'flex flex-1 items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-colors md:flex-none',
            pathname === href
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground',
          )}
        >
          <Icon
            className={cn('size-4', pathname === href && 'text-primary')}
            aria-hidden
          />{' '}
          {label}
        </Link>
      ))}
    </nav>
  );
}
