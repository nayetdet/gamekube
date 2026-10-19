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
        'inline-flex max-w-full items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold shadow-xs transition-all',
        online
          ? 'border-online/25 bg-online/10 text-online backdrop-blur-xs'
          : 'border-border bg-muted/60 text-muted-foreground',
        className,
      )}
    >
      <PresenceDot status={status} />
      <span className="truncate">
        {online && currentGame
          ? `🎮 Jogando ${currentGame}`
          : presenceLabels[status]}
      </span>
    </span>
  );
}
