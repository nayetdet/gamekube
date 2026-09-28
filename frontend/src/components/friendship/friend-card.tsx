import type { User } from '@/entities/user/user.entity';
import Link from 'next/link';
import { MessageCircleIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/button';
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
      <Button asChild variant="outline" size="icon-sm">
        <Link
          href={routes.conversation(friend.username)}
          aria-label={`Conversar com ${friend.username}`}
        >
          <MessageCircleIcon aria-hidden />
        </Link>
      </Button>
    </li>
  );
}
