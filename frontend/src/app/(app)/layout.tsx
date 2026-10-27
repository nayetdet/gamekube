import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PresenceBadge } from '@/components/presence/presence-badge';
import { LiveUpdates } from '@/components/realtime/live-updates';
import { UnreadMessagesLink } from '@/components/message/unread-messages-link';
import { getViewer, viewerRole } from '@/server/viewer';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const viewer = await getViewer();

  return (
    <AppShell
      viewer={viewer.user}
      role={viewerRole(viewer)}
      canSeeAdmin={viewer.isAdmin}
      toolbar={
        <div className="flex items-center gap-3">
          <UnreadMessagesLink />
          <PresenceBadge
            status={viewer.user.status}
            currentGame={viewer.user.currentGame}
          />
        </div>
      }
    >
      <LiveUpdates />
      {children}
    </AppShell>
  );
}
