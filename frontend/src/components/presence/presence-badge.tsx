import {
  presenceLabels,
  type PresenceStatus,
} from '@/entities/presence/presence.entity';
import { PresenceDot } from './presence-dot';
import { cn } from '@/lib/utils';

type PresenceBadgeProps = {
  status: PresenceStatus;
  currentGame?: string | null;
  className?: string;
};

export function PresenceBadge({
  status,
  currentGame,
  className,
}: PresenceBadgeProps) {
  const online = status === 'ONLINE';

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
        online ? 'bg-online/12 text-online' : 'bg-muted text-muted-foreground',
        className,
      )}
    >
      <PresenceDot status={status} />
      <span className="truncate">
        {online && currentGame
          ? `Jogando ${currentGame}`
          : presenceLabels[status]}
      </span>
    </span>
  );
}
