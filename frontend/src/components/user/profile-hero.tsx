import type { ReactNode } from 'react';
import { Gamepad2Icon } from 'lucide-react';
import { displayName, type User } from '@/entities/user/user.entity';
import { PresenceBadge } from '@/components/presence/presence-badge';
import { AvatarEditor } from './avatar-editor';
import { UserAvatar } from './user-avatar';
import { ProfileEditDialog } from './profile-edit-dialog';

type ProfileHeroProps = {
  user: User;
  editable?: boolean;
  action?: ReactNode;
};

export function ProfileHero({
  user,
  editable = false,
  action,
}: ProfileHeroProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="surface-aurora-gamer relative h-36 overflow-hidden sm:h-52">
        <div
          aria-hidden
          className="absolute -top-40 right-[14%] size-80 rounded-full border border-white/10 bg-white/[0.03]"
        />
        <div
          aria-hidden
          className="absolute -bottom-52 left-[30%] size-80 rounded-full border border-white/[0.08]"
        />
        <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-md">
          <Gamepad2Icon className="size-4" aria-hidden /> GameKube
        </div>
      </div>
      <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:gap-6 sm:px-8">
        <div className="relative -mt-14 w-fit shrink-0 sm:-mt-20">
          <UserAvatar
            user={user}
            size="xl"
            showPresence={false}
            className="size-28 ring-4 ring-card shadow-xl sm:size-40"
          />
          {editable && <AvatarEditor username={user.username} />}
        </div>
        <div className="min-w-0 flex-1 space-y-2 sm:pb-1">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-2xl font-extrabold tracking-tight sm:text-3xl">
              {displayName(user)}
            </h1>
            {editable && <ProfileEditDialog user={user} />}
          </div>
          <p className="truncate text-sm text-muted-foreground">
            @{user.username}
          </p>
          <PresenceBadge status={user.status} currentGame={user.currentGame} />
        </div>
        {action && <div className="sm:pb-1">{action}</div>}
      </div>
    </section>
  );
}
