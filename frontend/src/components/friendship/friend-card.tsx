import { displayName, type User } from '@/entities/user/user.entity';
import Link from 'next/link';
import { MessageCircleIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { formatRelative } from '@/lib/format';
import { UserAvatar } from '@/components/user/user-avatar';
import { RemoveFriendButton } from './remove-friend-button';

export function FriendCard({ friend }: { friend: User }) {
  return (
    <li className="flex min-w-0 flex-col items-center rounded-2xl border border-border bg-card p-5 text-center transition-colors hover:border-brand-400/50 motion-safe:transition-transform motion-safe:duration-300 motion-safe:hover:-translate-y-1">
      <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-3">
        <Link
          href={routes.player(friend.username)}
          aria-label={`Ver perfil de ${displayName(friend)}`}
        >
          <UserAvatar
            user={friend}
            size="xl"
            className="size-20 ring-4 ring-background"
          />
        </Link>
        <span className="w-full min-w-0 space-y-1">
          <Link
            href={routes.player(friend.username)}
            className="block truncate text-base font-bold hover:text-primary hover:underline"
          >
            {displayName(friend)}
          </Link>
          <span className="block truncate text-sm text-muted-foreground">
            @{friend.username}
          </span>
        </span>
        <span className="text-xs text-muted-foreground">
          {friend.status === 'ONLINE'
            ? friend.currentGame
              ? `Jogando ${friend.currentGame}`
              : 'Online'
            : friend.lastSeenAt
              ? `Visto ${formatRelative(friend.lastSeenAt)}`
              : 'Offline'}
        </span>
      </div>
      <div className="mt-5 flex w-full items-center gap-2 border-t border-border pt-4">
        <Button asChild variant="secondary" className="flex-1 font-semibold">
          <Link
            href={routes.conversation(friend.username)}
            aria-label={`Conversar com ${friend.username}`}
          >
            <MessageCircleIcon aria-hidden />
            Conversar
          </Link>
        </Button>
        <RemoveFriendButton username={friend.username} />
      </div>
    </li>
  );
}
