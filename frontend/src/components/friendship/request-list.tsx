import Link from 'next/link';
import { InboxIcon, SendIcon, UsersIcon, UserSearchIcon } from 'lucide-react';
import type { Friendship } from '@/entities/friendship/friendship.entity';
import { routes } from '@/config/routes';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/common/empty-state';
import { RequestCard } from './request-card';

type RequestListProps = {
  requests: Friendship[];
  direction: 'received' | 'sent';
};

export function RequestList({ requests, direction }: RequestListProps) {
  if (requests.length === 0) {
    if (direction === 'received') {
      return (
        <EmptyState
          icon={InboxIcon}
          title="Nenhum pedido pendente"
          description="Quando outros jogadores adicionarem você, o pedido aparecerá aqui para você aceitar."
          action={
            <Button asChild variant="outline" className="mt-2 font-semibold">
              <Link href={routes.friends}>
                <UsersIcon className="size-4" aria-hidden />
                Ver lista de amigos
              </Link>
            </Button>
          }
        />
      );
    }

    return (
      <EmptyState
        icon={SendIcon}
        title="Nada pendente"
        description="Os pedidos de amizade que você enviar aos jogadores ficarão aqui aguardando resposta."
        action={
          <Button asChild variant="outline" className="mt-2 font-semibold">
            <Link href={routes.users}>
              <UserSearchIcon className="size-4" aria-hidden />
              Buscar novos jogadores
            </Link>
          </Button>
        }
      />
    );
  }

  return (
    <ul className="space-y-3">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} direction={direction} />
      ))}
    </ul>
  );
}
