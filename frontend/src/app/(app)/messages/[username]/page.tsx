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
import { PageHeader } from '@/components/common/page-header';
import { ConversationPagination } from '@/components/message/conversation-pagination';
import { MessageComposer } from '@/components/message/message-composer';
import { MessageHistory } from '@/components/message/message-history';
import { ReadConversationForm } from '@/components/message/read-conversation-form';
import { PresenceBadge } from '@/components/presence/presence-badge';
import { Button } from '@/components/ui/button';

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
  const [{ user }, friends, page] = await Promise.all([
    getViewer(),
    friendshipService.listFriends(),
    messageService.conversation(username, query.page).catch((error) => {
      if (hasStatus(error, 404)) notFound();
      throw error;
    }),
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
    <>
      <Button asChild variant="ghost" size="sm" className="-ml-2 w-fit">
        <Link href={routes.messages}>
          <ArrowLeftIcon aria-hidden />
          Todas as conversas
        </Link>
      </Button>
      <PageHeader
        eyebrow="Mensagens"
        title={friend ? displayName(friend) : `@${username}`}
        description={`Conversa com @${username}`}
        actions={
          friend ? (
            <PresenceBadge
              status={friend.status}
              currentGame={friend.currentGame}
            />
          ) : undefined
        }
      />
      <ReadConversationForm username={username} unreadId={unread?.id} />
      <ConversationPagination meta={page.pageable} username={username} />
      <MessageHistory messages={page.content} username={user.username} />
      {friend ? (
        <MessageComposer username={username} />
      ) : (
        <p className="text-sm text-muted-foreground">
          Adicione esse jogador como amigo para enviar novas mensagens. O
          histórico continua disponível.
        </p>
      )}
    </>
  );
}
