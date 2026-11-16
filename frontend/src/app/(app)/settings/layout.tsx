import type { ReactNode } from 'react';
import { getViewer } from '@/server/viewer';
import { displayName } from '@/entities/user/user.entity';
import { PageHeader } from '@/components/common/page-header';
import { UserAvatar } from '@/components/user/user-avatar';
import { SettingsNav } from '@/components/layout/settings-nav';

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = await getViewer();
  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Gerencie as informações e as opções da sua conta."
      />
      <div className="grid items-start gap-6 md:grid-cols-[15rem_minmax(0,1fr)] lg:gap-8">
        <aside className="space-y-4" aria-label="Categorias de configurações">
          <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
            <UserAvatar user={user} size="lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">
                {displayName(user)}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                @{user.username}
              </p>
            </div>
          </div>
          <SettingsNav />
        </aside>
        {children}
      </div>
    </div>
  );
}
