import Link from 'next/link';
import { UserSearchIcon, UsersRoundIcon } from 'lucide-react';
import type { User } from '@/entities/user/user.entity';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { FriendCard } from './friend-card';

export function FriendList({ friends }: { friends: User[] }) {
  if (friends.length === 0) {
    return (
      <EmptyState
        icon={UsersRoundIcon}
        title="Sua lista está vazia"
        description="Adicione alguém pelo nome de usuário ou explore os jogadores cadastrados na plataforma."
        action={
          <Button asChild variant="outline" className="mt-2 font-semibold">
            <Link href={routes.users}>
              <UserSearchIcon className="size-4" aria-hidden />
              Explorar jogadores
            </Link>
          </Button>
        }
      />
    );
  }

  const ordered = [...friends].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'ONLINE' ? -1 : 1;
    return a.username.localeCompare(b.username);
  });

  return (
    <ul className="grid gap-3 xl:grid-cols-2">
      {ordered.map((friend) => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </ul>
  );
}
