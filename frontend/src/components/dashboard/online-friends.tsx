import Link from 'next/link';
import { MoonStarIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import type { User } from '@/entities/user/user.entity';
import { EmptyState } from '@/components/common/empty-state';
import { PresenceBadge } from '@/components/presence/presence-badge';
import { UserIdentity } from '@/components/user/user-identity';
import { Button } from '@/components/ui/button';

export function OnlineFriends({ friends }: { friends: User[] }) {
  const online = friends.filter((friend) => friend.status === 'ONLINE');

  if (online.length === 0) {
    return (
      <EmptyState
        icon={MoonStarIcon}
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
          className="flex items-center gap-3 rounded-xl bg-card p-3.5 ring-1 ring-border"
        >
          <UserIdentity user={friend} size="sm" className="flex-1" />
          <PresenceBadge
            status={friend.status}
            currentGame={friend.currentGame}
            className="max-w-40"
          />
        </li>
      ))}
    </ul>
  );
}
