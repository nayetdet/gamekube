'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  BellIcon,
  CheckCheckIcon,
  MessageCircleIcon,
  UserPlusIcon,
} from 'lucide-react';
import { Popover } from 'radix-ui';
import { routes } from '@/config/routes';
import type { Friendship } from '@/entities/friendship/friendship.entity';
import { displayName } from '@/entities/user/user.entity';
import type { ConversationSummary } from '@/services/message.service';
import { UserAvatar } from '@/components/user/user-avatar';
import { Button } from '@/components/ui/button';

export function Notifications({
  requests,
  conversations,
  unreadCount,
}: {
  requests: Friendship[];
  conversations: ConversationSummary[];
  unreadCount: number;
}) {
  const [open, setOpen] = useState(false);
  const unread = conversations.filter(
    (conversation) => conversation.unreadCount > 0,
  );
  const total = requests.length + unreadCount;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-3"
          aria-label={`Notificações: ${total} pendentes`}
        >
          <span className="relative">
            <BellIcon className="size-4" aria-hidden />
            {total > 0 && (
              <span className="absolute -top-2 -right-3 flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-4 text-primary-foreground">
                {total > 99 ? '99+' : total}
              </span>
            )}
          </span>
          <span className="hidden sm:inline">Notificações</span>
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={12}
          className="z-50 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-xl motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-200"
        >
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-bold">Notificações</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Pedidos de amizade e mensagens não lidas
            </p>
          </div>
          <div className="max-h-[min(26rem,60vh)] overflow-y-auto p-2">
            {total === 0 ? (
              <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-sm text-muted-foreground">
                <CheckCheckIcon className="size-6 text-primary" aria-hidden />
                <p>Você está em dia!</p>
                <p className="text-xs">Nenhuma notificação por enquanto.</p>
              </div>
            ) : (
              <>
                {requests.map((request) => (
                  <Link
                    key={request.id}
                    href={routes.friendRequests}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <UserAvatar user={request.requester} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {displayName(request.requester)}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        Enviou um pedido de amizade
                      </span>
                    </span>
                    <UserPlusIcon
                      className="size-4 shrink-0 text-primary"
                      aria-hidden
                    />
                  </Link>
                ))}
                {unread.map((conversation) => (
                  <Link
                    key={conversation.username}
                    href={routes.conversation(conversation.username)}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-ring"
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <MessageCircleIcon className="size-5" aria-hidden />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        @{conversation.username}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        Última mensagem: {conversation.lastMessage}
                      </span>
                    </span>
                    <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                      {conversation.unreadCount}
                    </span>
                  </Link>
                ))}
              </>
            )}
          </div>
          <div className="flex justify-between gap-4 border-t border-border px-5 py-3 text-xs font-semibold text-primary">
            <Link
              href={routes.friendRequests}
              onClick={() => setOpen(false)}
              className="hover:underline"
            >
              Ver pedidos
            </Link>
            <Link
              href={routes.messages}
              onClick={() => setOpen(false)}
              className="hover:underline"
            >
              Ver mensagens
            </Link>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
