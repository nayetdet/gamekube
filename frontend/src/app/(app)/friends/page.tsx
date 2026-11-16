import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { friendshipService } from '@/services/friendship.service';
import { PageHeader } from '@/components/common/page-header';
import { AddFriendDialog } from '@/components/friendship/add-friend-dialog';
import { FriendList } from '@/components/friendship/friend-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { pageCount, pageRange } from '@/entities/shared/page.entity';
import { redirect } from 'next/navigation';

export const metadata: Metadata = { title: 'Amigos' };

export default async function FriendsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const value = (await searchParams).page;
  const pageNumber =
    value && /^\d+$/.test(value) ? Math.min(Number(value), 1000000) : 0;
  const [friends, received] = await Promise.all([
    friendshipService.listFriendsPage(pageNumber),
    friendshipService.listReceivedRequests(),
  ]);
  const pages = pageCount(friends.pageable);
  if (pageNumber > 0 && pageNumber >= pages)
    redirect(`${routes.friends}?page=${Math.max(pages - 1, 0)}`);
  const { from, to } = pageRange(friends.pageable);

  return (
    <>
      <PageHeader
        eyebrow="Social"
        title="Amigos"
        description={`${friends.pageable.total} ${friends.pageable.total === 1 ? 'jogador' : 'jogadores'} na sua lista.`}
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
      <FriendList friends={friends.content} />
      {pages > 1 && (
        <nav
          aria-label="Páginas de amigos"
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <p className="text-sm text-muted-foreground">
            {from}–{to} de {friends.pageable.total}
          </p>
          <div className="flex items-center gap-3">
            {pageNumber > 0 ? (
              <Button asChild variant="outline" size="icon">
                <Link
                  href={`${routes.friends}?page=${pageNumber - 1}`}
                  aria-label="Anterior"
                >
                  <ChevronLeftIcon aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                aria-label="Anterior"
                disabled
              >
                <ChevronLeftIcon aria-hidden="true" />
              </Button>
            )}
            <span className="text-sm font-semibold">
              {pageNumber + 1} / {pages}
            </span>
            {pageNumber + 1 < pages ? (
              <Button asChild variant="outline" size="icon">
                <Link
                  href={`${routes.friends}?page=${pageNumber + 1}`}
                  aria-label="Próxima"
                >
                  <ChevronRightIcon aria-hidden="true" />
                </Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="icon"
                aria-label="Próxima"
                disabled
              >
                <ChevronRightIcon aria-hidden="true" />
              </Button>
            )}
          </div>
        </nav>
      )}
    </>
  );
}
