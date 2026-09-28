import Link from 'next/link';
import { MessageCircleIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import type { User } from '@/entities/user/user.entity';
import { EmptyState } from '@/components/common/empty-state';
import { PresenceBadge } from '@/components/presence/presence-badge';
import { UserIdentity } from '@/components/user/user-identity';
import { Button } from '@/components/ui/button';

export function ConversationList({ friends }: { friends: User[] }) {
  if (friends.length === 0)
    return (
      <EmptyState
        icon={MessageCircleIcon}
        title="Encontre alguém para conversar"
        description="Adicione amigos para trocar mensagens e combinar uma partida."
        action={
          <Button asChild>
            <Link href={routes.friends}>Adicionar amigos</Link>
          </Button>
        }
      />
    );
  return (
    <ul className="space-y-3">
      {friends.map((friend) => (
        <li key={friend.id}>
          <Link
            href={routes.conversation(friend.username)}
            className="flex flex-wrap items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-border transition-shadow hover:shadow-sm"
          >
            <UserIdentity user={friend} className="flex-1" />
            <PresenceBadge
              status={friend.status}
              currentGame={friend.currentGame}
            />
            <MessageCircleIcon
              className="size-5 text-muted-foreground"
              aria-hidden
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
