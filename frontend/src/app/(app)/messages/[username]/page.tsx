import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ArrowLeftIcon } from 'lucide-react';
import { routes } from '@/config/routes';
import { conversationQuerySchema } from '@/entities/message/message.schema';
import { usernameParamSchema } from '@/entities/user/user.schema';
import { pageCount } from '@/entities/shared/page.entity';
import { displayName } from '@/entities/user/user.entity';
import { friendshipService } from '@/services/friendship.service';
import { hasStatus } from '@/services/http/api-error';
import { messageService } from '@/services/message.service';
import { getViewer } from '@/server/viewer';
import { ConversationList } from '@/components/message/conversation-list';
import { ConversationPagination } from '@/components/message/conversation-pagination';
import { MessageComposer } from '@/components/message/message-composer';
import { MessageHistory } from '@/components/message/message-history';
import { ReadConversationForm } from '@/components/message/read-conversation-form';
import { Button } from '@/components/ui/button';
import { UserAvatar } from '@/components/user/user-avatar';

export async function generateMetadata(
  props: PageProps<'/messages/[username]'>,
): Promise<Metadata> {
  return { title: `Conversa com @${(await props.params).username}` };
}

export default async function ConversationPage(
  props: PageProps<'/messages/[username]'>,
) {
  const parsed = usernameParamSchema.safeParse((await props.params).username);
  if (!parsed.success) notFound();
  const username = parsed.data;
  const query = conversationQuerySchema.parse(await props.searchParams);
  const [{ user }, friends, page, summaries] = await Promise.all([
    getViewer(),
    friendshipService.listFriends(),
    messageService.conversation(username, query.page).catch((error) => {
      if (hasStatus(error, 404)) notFound();
      throw error;
    }),
    messageService.summaries(),
  ]);
  if (user.username === username) redirect(routes.messages);
  if (query.page > 0 && query.page >= pageCount(page.pageable))
    redirect(routes.conversation(username));
  const friend = friends.find((item) => item.username === username);
  const unread =
    query.page === 0
      ? page.content.find(
          (message) =>
            message.recipientUsername === user.username &&
            message.status !== 'READ',
        )
      : undefined;
  return (
    <div className="grid min-h-[calc(100svh-8.5rem)] overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="hidden border-r border-border md:block">
        <ConversationList
          friends={friends}
          summaries={summaries}
          selected={username}
        />
      </aside>
      <section
        className="flex min-w-0 flex-col"
        aria-label={`Conversa com @${username}`}
      >
        <header className="flex items-center gap-3 border-b border-border p-4 sm:px-6">
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Link href={routes.messages} aria-label="Todas as conversas">
              <ArrowLeftIcon aria-hidden />
            </Link>
          </Button>
          {friend ? (
            <Link
              href={routes.player(friend.username)}
              className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-ring"
              aria-label={`Ver perfil de ${displayName(friend)}`}
            >
              <UserAvatar user={friend} />
              <span className="min-w-0">
                <span className="block truncate text-lg font-bold group-hover:text-primary">
                  {displayName(friend)}
                </span>
                <span className="block truncate text-sm text-muted-foreground">
                  @{username}
                </span>
              </span>
            </Link>
          ) : (
            <h1 className="min-w-0 flex-1 truncate text-lg font-bold">
              @{username}
            </h1>
          )}
        </header>
        <ReadConversationForm username={username} unreadId={unread?.id} />
        <div className="flex flex-1 flex-col gap-4 bg-muted/20 p-4 sm:p-6">
          <ConversationPagination meta={page.pageable} username={username} />
          <div className="mt-auto">
            <MessageHistory messages={page.content} username={user.username} />
          </div>
        </div>
        {friend ? (
          <MessageComposer username={username} />
        ) : (
          <p className="border-t border-border p-4 text-sm text-muted-foreground">
            Adicione esse jogador como amigo para enviar novas mensagens. O
            histórico continua disponível.
          </p>
        )}
      </section>
    </div>
  );
}
