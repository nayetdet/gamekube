import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { LiveUpdates } from '@/components/realtime/live-updates';
import { Notifications } from '@/components/layout/notifications';
import { getViewer, viewerRole } from '@/server/viewer';
import { messageService } from '@/services/message.service';
import { friendshipService } from '@/services/friendship.service';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const [viewer, { unreadCount }, requests, conversations] = await Promise.all([
    getViewer(),
    messageService.countUnread(),
    friendshipService.listReceivedRequests(),
    messageService.summaries(),
  ]);

  return (
    <AppShell
      viewer={viewer.user}
      role={viewerRole(viewer)}
      canSeeAdmin={viewer.isAdmin}
      unreadCount={unreadCount}
      requestCount={requests.length}
      toolbar={
        <div className="flex items-center gap-3">
          <Notifications
            requests={requests}
            conversations={conversations}
            unreadCount={unreadCount}
          />
        </div>
      }
    >
      <LiveUpdates />
      {children}
    </AppShell>
  );
}
