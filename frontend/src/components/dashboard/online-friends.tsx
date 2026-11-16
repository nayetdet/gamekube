import Link from 'next/link';
import { UsersRoundIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import type { User } from '@/entities/user/user.entity';
import { EmptyState } from '@/components/common/empty-state';
import { UserAvatar } from '@/components/user/user-avatar';
import { displayName } from '@/entities/user/user.entity';
import { Gamepad2Icon, MessageCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OnlineFriends({ friends }: { friends: User[] }) {
  const online = friends.filter((friend) => friend.status === 'ONLINE');

  if (online.length === 0) {
    return (
      <EmptyState
        icon={UsersRoundIcon}
        title="Ninguém está online"
        description="Seus amigos aparecerão aqui assim que ficarem online."
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={routes.friends}>Abrir sua lista</Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {online.map((friend) => (
        <li
          key={friend.id}
          className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-accent/30"
        >
          <Link
            href={routes.player(friend.username)}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <UserAvatar user={friend} size="lg" />
            <span className="min-w-0">
              <span className="block truncate font-semibold group-hover:text-primary">
                {displayName(friend)}
              </span>
              <span className="mt-1 flex items-center gap-1.5 truncate text-xs text-online">
                {friend.currentGame ? (
                  <>
                    <Gamepad2Icon className="size-3.5" aria-hidden /> Jogando{' '}
                    {friend.currentGame}
                  </>
                ) : (
                  'Online'
                )}
              </span>
            </span>
          </Link>
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label={`Conversar com ${displayName(friend)}`}
          >
            <Link href={routes.conversation(friend.username)}>
              <MessageCircleIcon aria-hidden />
            </Link>
          </Button>
        </li>
      ))}
    </ul>
  );
}
