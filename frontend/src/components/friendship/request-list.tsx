import { InboxIcon, SendIcon } from 'lucide-react';
import type { Friendship } from '@/entities/friendship/friendship.entity';
import { EmptyState } from '@/components/common/empty-state';
import { RequestCard } from './request-card';

type RequestListProps = {
  requests: Friendship[];
  direction: 'received' | 'sent';
};

const empty = {
  received: {
    icon: InboxIcon,
    title: 'Nenhum pedido pendente',
    description: 'Quando alguém adicionar você, o pedido aparece aqui.',
  },
  sent: {
    icon: SendIcon,
    title: 'Nada pendente',
    description: 'Os pedidos que você envia ficam aqui até serem respondidos.',
  },
} as const;

export function RequestList({ requests, direction }: RequestListProps) {
  if (requests.length === 0) return <EmptyState {...empty[direction]} />;

  return (
    <ul className="space-y-3">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} direction={direction} />
      ))}
    </ul>
  );
}
