import type { ReactNode } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { PresenceQuickToggle } from '@/components/presence/presence-quick-toggle';
import { getViewer, viewerRole } from '@/server/viewer';

export default async function AppLayout({ children }: { children: ReactNode }) {
  const viewer = await getViewer();

  return (
    <AppShell
      viewer={viewer.user}
      role={viewerRole(viewer)}
      canSeeAdmin={viewer.isAdmin}
      toolbar={
        <PresenceQuickToggle
          status={viewer.user.status}
          currentGame={viewer.user.currentGame}
        />
      }
    >
      {children}
    </AppShell>
  );
}
