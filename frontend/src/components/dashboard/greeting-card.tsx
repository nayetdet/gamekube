import { displayName, type User } from '@/entities/user/user.entity';
import { PresenceForm } from '@/components/presence/presence-form';
import { UserAvatar } from '@/components/user/user-avatar';

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 6) return 'Ainda acordado';
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export function GreetingCard({ user }: { user: User }) {
  return (
    <section className="surface-aurora space-y-6 rounded-2xl border border-border p-6 sm:p-7">
      <div className="flex items-center gap-4">
        <UserAvatar user={user} size="lg" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-brand-700">{greeting()},</p>
          <h2 className="truncate text-xl font-extrabold tracking-tight">
            {displayName(user)}
          </h2>
        </div>
      </div>
      <PresenceForm status={user.status} currentGame={user.currentGame} />
    </section>
  );
}
