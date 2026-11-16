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
    <li className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:border-primary/40 sm:px-6">
      <UserIdentity user={player} size="lg" className="min-w-48 flex-1" />
      <span className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground">
        <ClockIcon className="size-3.5" aria-hidden />
        {formatRelative(request.createdAt)}
      </span>
      {received ? (
        <RequestActions username={request.requester.username} />
      ) : (
        <span className="inline-flex items-center rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning border border-warning/20">
          Aguardando resposta
        </span>
      )}
    </li>
  );
}
