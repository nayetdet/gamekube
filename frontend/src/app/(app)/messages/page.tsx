import type { Metadata } from 'next';
import { friendshipService } from '@/services/friendship.service';
import { messageService } from '@/services/message.service';
import { PageHeader } from '@/components/common/page-header';
import { ConversationList } from '@/components/message/conversation-list';

export const metadata: Metadata = { title: 'Mensagens' };

export default async function MessagesPage() {
  const [friends, { unreadCount }] = await Promise.all([
    friendshipService.listFriends(),
    messageService.countUnread(),
  ]);
  return (
    <>
      <PageHeader
        eyebrow="Social"
        title="Mensagens"
        description={
          unreadCount
            ? `${unreadCount} ${unreadCount === 1 ? 'mensagem não lida' : 'mensagens não lidas'}. Escolha um amigo para conversar.`
            : 'Escolha um amigo para conversar e combinar uma partida.'
        }
      />
      <ConversationList friends={friends} />
    </>
  );
}
