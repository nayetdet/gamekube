import { RadioIcon } from 'lucide-react';
import type { User } from '@/entities/user/user.entity';
import { formatDateTime, formatRelative } from '@/lib/format';
import { PresenceBadge } from './presence-badge';

export function LivePresence({ user: presence }: { user: User }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
      <PresenceBadge
        status={presence.status}
        currentGame={presence.currentGame}
      />
      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <RadioIcon className="size-4" aria-hidden />
        Visto por último {formatRelative(presence.lastSeenAt)}
        {presence.lastSeenAt ? ` · ${formatDateTime(presence.lastSeenAt)}` : ''}
      </p>
    </div>
  );
}

export function LivePresenceSkeleton() {
  return (
    <div className="flex items-center gap-4">
      <span className="h-6 w-24 animate-pulse rounded-full bg-muted" />
      <span className="h-4 w-40 animate-pulse rounded bg-muted" />
    </div>
  );
}
