import Link from 'next/link';
import { MessageCircleIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { messageService } from '@/services/message.service';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export async function UnreadMessagesLink() {
  const { unreadCount } = await messageService.countUnread();
  return (
    <Button asChild variant="ghost" size="sm">
      <Link
        href={routes.messages}
        aria-label={`Mensagens: ${unreadCount} não lidas`}
      >
        <MessageCircleIcon aria-hidden />
        <span className="hidden sm:inline">Mensagens</span>
        {unreadCount > 0 ? <Badge>{unreadCount}</Badge> : null}
      </Link>
    </Button>
  );
}
