import type { User } from '@/entities/user/user.entity';
import { formatRelative } from '@/lib/format';
import { PresenceBadge } from '@/components/presence/presence-badge';
import { UserIdentity } from '@/components/user/user-identity';
import { RemoveFriendButton } from './remove-friend-button';

export function FriendCard({ friend }: { friend: User }) {
  return (
    <li className="flex items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-border transition-shadow hover:shadow-sm">
      <UserIdentity user={friend} className="flex-1" />
      <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
        <PresenceBadge
          status={friend.status}
          currentGame={friend.currentGame}
        />
        {friend.status === 'OFFLINE' ? (
          <span className="text-xs text-muted-foreground">
            Visto {formatRelative(friend.lastSeenAt)}
          </span>
        ) : null}
      </div>
      <RemoveFriendButton username={friend.username} />
    </li>
  );
}
