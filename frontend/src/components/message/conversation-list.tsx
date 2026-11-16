'use client';

import { useState } from 'react';
import Link from 'next/link';
import { MessageCircleIcon, SearchIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { displayName, type User } from '@/entities/user/user.entity';
import { UserAvatar } from '@/components/user/user-avatar';
import { cn } from '@/lib/utils';
import type { ConversationSummary } from '@/services/message.service';
import { UnreadBadge } from './unread-badge';

export function ConversationList({
  friends,
  selected,
  summaries,
}: {
  friends: User[];
  summaries: ConversationSummary[];
  selected?: string;
}) {
  const [query, setQuery] = useState('');
  const byUsername = new Map(
    summaries.map((summary, index) => [summary.username, { summary, index }]),
  );
  const matches = friends
    .filter((friend) =>
      `${displayName(friend)} ${friend.username}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
    )
    .sort(
      (a, b) =>
        (byUsername.get(a.username)?.index ?? Infinity) -
        (byUsername.get(b.username)?.index ?? Infinity),
    );
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <div>
        <h2 className="text-lg font-bold">Conversas</h2>
        <p className="mt-1 text-sm text-muted-foreground">Suas conversas</p>
      </div>
      <label className="flex h-10 items-center gap-2 rounded-xl bg-muted px-3 text-muted-foreground">
        <SearchIcon className="size-4 shrink-0" aria-hidden />
        <span className="sr-only">Pesquisar conversas</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Pesquisar conversas"
          className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </label>
      {friends.length === 0 ? (
        <div className="space-y-3 py-6 text-center text-sm text-muted-foreground">
          <MessageCircleIcon className="mx-auto size-6" aria-hidden />
          <p>Adicione amigos para começar uma conversa.</p>
          <Link
            href={routes.friends}
            className="font-semibold text-primary hover:underline"
          >
            Encontrar amigos
          </Link>
        </div>
      ) : matches.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Nenhuma conversa encontrada.
        </p>
      ) : (
        <ul className="space-y-1 overflow-y-auto">
          {matches.map((friend) => {
            const summary = byUsername.get(friend.username)?.summary;
            return (
              <li key={friend.id}>
                <Link
                  href={routes.conversation(friend.username)}
                  aria-current={
                    selected === friend.username ? 'page' : undefined
                  }
                  className={cn(
                    'flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-muted',
                    selected === friend.username && 'bg-muted',
                  )}
                >
                  <UserAvatar user={friend} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {displayName(friend)}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {summary
                        ? `${summary.lastSenderUsername === friend.username ? '' : 'Você: '}${summary.lastMessage}`
                        : 'Comece uma conversa'}
                    </span>
                  </span>
                  <UnreadBadge count={summary?.unreadCount ?? 0} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
