import type { ReactNode } from 'react';
import { MobileSidebar } from './mobile-sidebar';
import type { SidebarProps } from './sidebar';
import { ViewerMenu } from './viewer-menu';

type TopBarProps = Omit<SidebarProps, 'onNavigate'> & {
  children?: ReactNode;
  floating?: boolean;
};

export function TopBar({
  children,
  floating = false,
  ...sidebar
}: TopBarProps) {
  return (
    <header
      className={
        floating
          ? 'absolute inset-x-0 top-0 z-30 flex h-16 items-center gap-3 px-4 lg:px-8'
          : 'sticky top-0 z-30 flex h-16 items-center gap-3 bg-background/80 px-4 backdrop-blur-md lg:px-8'
      }
    >
      <MobileSidebar {...sidebar} />
      <div className="ml-auto flex items-center gap-2 rounded-full border border-border bg-background/75 p-1.5 shadow-xl backdrop-blur-xl">
        {children}
        <ViewerMenu viewer={sidebar.viewer} role={sidebar.role} compact />
      </div>
    </header>
  );
}
