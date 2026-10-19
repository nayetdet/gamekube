import { SparklesIcon } from 'lucide-react';
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
    <Card className="overflow-hidden gap-0 py-0 shadow-sm border-border/80">
      {/* Dynamic Cyber Aurora Gamer Banner */}
      <div className="relative surface-aurora-gamer h-28 border-b border-border/40 sm:h-36 overflow-hidden">
        <div className="absolute inset-0 surface-grid-pattern opacity-60" />
        <div className="absolute top-3 right-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md border border-white/10 shadow-xs">
          <SparklesIcon className="size-3 text-brand-300 animate-pulse" />
          <span>GameKube Player</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3.5 px-(--card-spacing) pb-6 text-center">
        {/* Avatar with gamer glow ring */}
        <div className="relative -mt-16 sm:-mt-20">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
          <UserAvatar
            user={user}
            size="xl"
            showPresence={false}
            className="relative ring-4 ring-card shadow-lg sm:size-40"
          />
        </div>

        <div className="max-w-full space-y-1">
          <h2 className="truncate font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
            {displayName(user)}
          </h2>
          <p className="truncate font-mono text-xs font-semibold text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full inline-block">
            @{user.username}
          </p>
        </div>

        <PresenceBadge status={user.status} currentGame={user.currentGame} />

        <p className="max-w-prose text-sm wrap-anywhere whitespace-pre-line text-muted-foreground/90 italic">
          {user.description?.trim()
            ? `“${user.description.trim()}”`
            : 'Nenhuma biografia configurada ainda.'}
        </p>
      </div>

      <ProfileStats stats={stats} />
    </Card>
  );
}
