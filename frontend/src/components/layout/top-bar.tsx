import type { ReactNode } from 'react';
import { MobileSidebar } from './mobile-sidebar';
import { TopBarTitle } from './top-bar-title';
import type { SidebarProps } from './sidebar';

type TopBarProps = Omit<SidebarProps, 'onNavigate'> & {
  children?: ReactNode;
};

export function TopBar({ children, ...sidebar }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md lg:px-8">
      <MobileSidebar {...sidebar} />
      <TopBarTitle />
      <div className="ml-auto flex items-center gap-3">{children}</div>
    </header>
  );
}
