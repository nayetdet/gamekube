import { displayName, type User } from '@/entities/user/user.entity';
import { PresenceBadge } from '@/components/presence/presence-badge';
import { Card } from '@/components/ui/card';
import { ProfileStats, type ProfileStat } from './profile-stats';
import { UserAvatar } from './user-avatar';

type ProfileHeroProps = {
  user: User;
  stats: readonly ProfileStat[];
};

export function ProfileHero({ user, stats }: ProfileHeroProps) {
  return (
    <Card className="gap-0 py-0">
      <div className="surface-aurora-strong h-24 border-b sm:h-28" />

      <div className="flex flex-col items-center gap-3 px-(--card-spacing) pb-6 text-center">
        <UserAvatar
          user={user}
          size="xl"
          showPresence={false}
          className="-mt-16 ring-4 ring-card sm:-mt-20"
        />

        <div className="max-w-full space-y-1">
          <h2 className="truncate font-heading text-2xl font-extrabold sm:text-3xl">
            {displayName(user)}
          </h2>
          <p className="truncate font-mono text-sm text-muted-foreground">
            @{user.username}
          </p>
        </div>

        <PresenceBadge status={user.status} currentGame={user.currentGame} />

        <p className="max-w-prose text-sm wrap-anywhere whitespace-pre-line text-muted-foreground">
          {user.description?.trim() || 'Ainda sem bio.'}
        </p>
      </div>

      <ProfileStats stats={stats} />
    </Card>
  );
}
