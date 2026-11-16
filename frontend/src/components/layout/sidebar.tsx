import type { User } from '@/entities/user/user.entity';
import { SidebarBrand } from './sidebar-brand';
import { SidebarNav } from './sidebar-nav';
import Image from 'next/image';
import Link from 'next/link';

export type SidebarProps = {
  viewer: Pick<User, 'name' | 'username' | 'status'>;
  role: string;
  canSeeAdmin: boolean;
  unreadCount?: number;
  requestCount?: number;
  onNavigate?: () => void;
  compact?: boolean;
};

export function Sidebar({
  canSeeAdmin,
  onNavigate,
  unreadCount = 0,
  requestCount = 0,
  compact = false,
}: SidebarProps) {
  return (
    <div
      className={`flex h-full flex-col gap-6 bg-background/75 py-5 backdrop-blur-xl ${compact ? 'px-2' : 'px-4'}`}
    >
      {compact ? (
        <Link
          href="/dashboard"
          aria-label="GameKube"
          className="mx-auto block w-10"
        >
          <Image src="/gamekube-brand-blue.png" alt="" width={40} height={40} />
        </Link>
      ) : (
        <SidebarBrand />
      )}
      <div className="scrollbar-slim flex-1 overflow-y-auto">
        <SidebarNav
          canSeeAdmin={canSeeAdmin}
          onNavigate={onNavigate}
          unreadCount={unreadCount}
          requestCount={requestCount}
          compact={compact}
        />
      </div>
    </div>
  );
}
