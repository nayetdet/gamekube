import { ClockIcon } from 'lucide-react';
import type { Friendship } from '@/entities/friendship/friendship.entity';
import { formatRelative } from '@/lib/format';
import { UserIdentity } from '@/components/user/user-identity';
import { RequestActions } from './request-actions';

type RequestCardProps = {
  request: Friendship;
  direction: 'received' | 'sent';
};

export function RequestCard({ request, direction }: RequestCardProps) {
  const received = direction === 'received';
  const player = received ? request.requester : request.addressee;

  return (
    <li className="flex flex-wrap items-center gap-3 rounded-xl bg-card p-4 ring-1 ring-border">
      <UserIdentity user={player} className="min-w-48 flex-1" />
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ClockIcon className="size-3.5" aria-hidden />
        {formatRelative(request.createdAt)}
      </span>
      {received ? (
        <RequestActions id={request.id} />
      ) : (
        <span className="rounded-full bg-warning/12 px-2.5 py-1 text-xs font-semibold text-warning">
          Aguardando resposta
        </span>
      )}
    </li>
  );
}
