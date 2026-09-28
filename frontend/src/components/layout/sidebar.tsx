import type { User } from '@/entities/user/user.entity';
import { SidebarBrand } from './sidebar-brand';
import { SidebarNav } from './sidebar-nav';
import { ViewerMenu } from './viewer-menu';

export type SidebarProps = {
  viewer: Pick<User, 'name' | 'username' | 'status'>;
  role: string;
  canSeeAdmin: boolean;
  onNavigate?: () => void;
};

export function Sidebar({
  viewer,
  role,
  canSeeAdmin,
  onNavigate,
}: SidebarProps) {
  return (
    <div className="flex h-full flex-col gap-6 bg-sidebar px-4 py-5">
      <SidebarBrand />
      <div className="scrollbar-slim flex-1 overflow-y-auto">
        <SidebarNav canSeeAdmin={canSeeAdmin} onNavigate={onNavigate} />
      </div>
      <ViewerMenu viewer={viewer} role={role} />
    </div>
  );
}
