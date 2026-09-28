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
  return (
    <span
      aria-hidden
      className={cn('size-2 shrink-0 rounded-full', tone[status], className)}
    />
  );
}
