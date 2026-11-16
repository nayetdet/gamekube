'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ChevronLeftIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CSSProperties, ReactNode } from 'react';
import { Sidebar, type SidebarProps } from './sidebar';
import { TopBar } from './top-bar';
import { Breadcrumbs } from './breadcrumbs';

type AppShellProps = Omit<SidebarProps, 'onNavigate'> & {
  toolbar?: ReactNode;
  children: ReactNode;
};

export function AppShell({ toolbar, children, ...sidebar }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isMessages =
    pathname === '/messages' || pathname.startsWith('/messages/');
  const isDashboard = pathname === '/dashboard';
  return (
    <div
      className={`relative flex ${isMessages ? 'h-svh overflow-hidden' : 'min-h-svh'}`}
      style={
        {
          '--dashboard-sidebar-offset': sidebarOpen ? '19rem' : '7rem',
        } as CSSProperties
      }
    >
      <aside
        className={`${isDashboard ? 'absolute inset-y-0 left-0' : 'relative'} z-40 hidden shrink-0 pl-2 transition-[width] duration-300 ease-in-out motion-reduce:transition-none lg:block ${sidebarOpen ? 'w-70' : 'w-18'}`}
      >
        <div className="sticky top-4 h-[calc(100svh-2rem)]">
          <div
            id="desktop-sidebar"
            className="h-full overflow-hidden rounded-2xl border border-border shadow-xl"
          >
            <Sidebar {...sidebar} compact={!sidebarOpen} />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen((open) => !open)}
            aria-controls="desktop-sidebar"
            aria-expanded={sidebarOpen}
            aria-label={
              sidebarOpen ? 'Recolher barra lateral' : 'Expandir barra lateral'
            }
            title={
              sidebarOpen ? 'Recolher barra lateral' : 'Expandir barra lateral'
            }
            className="absolute top-1/2 right-0 z-40 size-7 -translate-y-1/2 translate-x-1/2 rounded-full border border-border bg-card text-foreground shadow-lg transition-colors hover:bg-accent"
          >
            <ChevronLeftIcon
              className={`size-4 transition-transform duration-300 ease-out motion-reduce:transition-none ${sidebarOpen ? '' : 'rotate-180'}`}
              aria-hidden
            />
          </Button>
        </div>
      </aside>
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <TopBar {...sidebar} floating={isDashboard}>
          {toolbar}
        </TopBar>
        <main
          key={pathname}
          className={`mx-auto w-full flex-1 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 ${isDashboard ? 'max-w-none' : `px-4 pt-2 pb-6 lg:px-6 ${isMessages ? 'flex min-h-0 max-w-none flex-col gap-4' : 'max-w-7xl space-y-4'}`}`}
        >
          {!isDashboard && <Breadcrumbs />}
          {children}
        </main>
      </div>
    </div>
  );
}
