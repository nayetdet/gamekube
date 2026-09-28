import type { ReactNode } from 'react';
import { Sidebar, type SidebarProps } from './sidebar';
import { TopBar } from './top-bar';

type AppShellProps = Omit<SidebarProps, 'onNavigate'> & {
  toolbar?: ReactNode;
  children: ReactNode;
};

export function AppShell({ toolbar, children, ...sidebar }: AppShellProps) {
  return (
    <div className="flex min-h-svh">
      <aside className="hidden w-68 shrink-0 border-r border-sidebar-border lg:block">
        <div className="sticky top-0 h-svh">
          <Sidebar {...sidebar} />
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar {...sidebar}>{toolbar}</TopBar>
        <main className="mx-auto w-full max-w-6xl flex-1 space-y-8 px-4 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
