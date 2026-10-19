import type { Metadata } from 'next';
import Link from 'next/link';
import { routes } from '@/config/routes';
import { friendshipService } from '@/services/friendship.service';
import { PageHeader } from '@/components/common/page-header';
import { AddFriendDialog } from '@/components/friendship/add-friend-dialog';
import { FriendList } from '@/components/friendship/friend-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Amigos' };

export default async function FriendsPage() {
  const [friends, received] = await Promise.all([
    friendshipService.listFriends(),
    friendshipService.listReceivedRequests(),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Social"
        title="Amigos"
        description={`${friends.length} ${friends.length === 1 ? 'jogador' : 'jogadores'} na sua lista.`}
        actions={
          <>
            <Button asChild variant="outline" className="font-semibold">
              <Link href={routes.friendRequests}>
                Pedidos
                {received.length > 0 ? (
                  <Badge className="ml-1">{received.length}</Badge>
                ) : null}
              </Link>
            </Button>
            <AddFriendDialog />
          </>
        }
      />
      <FriendList friends={friends} />
    </>
  );
}
