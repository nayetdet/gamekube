import Link from 'next/link';
import { MessageCircleIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { UnreadBadge } from './unread-badge';
import { Button } from '@/components/ui/button';

export function UnreadMessagesLink({ unreadCount }: { unreadCount: number }) {
  return (
    <Button asChild variant="ghost" size="sm" className="gap-4">
      <Link
        href={routes.messages}
        aria-label={`Mensagens: ${unreadCount} não lidas`}
      >
        <span className="relative shrink-0">
          <MessageCircleIcon className="size-4" aria-hidden />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-3">
              <UnreadBadge count={unreadCount} />
            </span>
          )}
        </span>
        <span className="hidden sm:inline">Mensagens</span>
      </Link>
    </Button>
  );
}
