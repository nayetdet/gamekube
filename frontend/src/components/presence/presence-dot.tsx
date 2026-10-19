import type { PresenceStatus } from '@/entities/presence/presence.entity';
import { cn } from '@/lib/utils';

const tone: Record<PresenceStatus, string> = {
  ONLINE: 'bg-online',
  OFFLINE: 'bg-offline',
};

export function PresenceDot({
  status,
  className,
}: {
  status: PresenceStatus;
  className?: string;
}) {
  const isOnline = status === 'ONLINE';

  return (
    <span className="relative flex size-2 shrink-0 items-center justify-center">
      {isOnline ? (
        <span
          aria-hidden
          className="absolute inline-flex size-full animate-ping rounded-full bg-online opacity-75"
        />
      ) : null}
      <span
        aria-hidden
        className={cn('size-2 shrink-0 rounded-full', tone[status], className)}
      />
    </span>
  );
}
