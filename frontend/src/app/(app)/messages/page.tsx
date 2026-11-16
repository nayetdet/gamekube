import type { Metadata } from 'next';
import { friendshipService } from '@/services/friendship.service';
import { ConversationList } from '@/components/message/conversation-list';
import { MessageCircleIcon } from 'lucide-react';
import { messageService } from '@/services/message.service';

export const metadata: Metadata = { title: 'Mensagens' };

export default async function MessagesPage() {
  const [friends, summaries] = await Promise.all([
    friendshipService.listFriends(),
    messageService.summaries(),
  ]);
  return (
    <div className="grid min-h-0 flex-1 overflow-hidden rounded-2xl border border-border bg-card md:grid-cols-[18rem_minmax(0,1fr)]">
      <aside className="min-h-0 border-border md:border-r">
        <ConversationList friends={friends} summaries={summaries} />
      </aside>
      <div className="hidden flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground md:flex">
        <div className="rounded-2xl bg-muted p-4">
          <MessageCircleIcon className="size-7" aria-hidden />
        </div>
        <h2 className="text-lg font-semibold text-foreground">
          Escolha uma conversa
        </h2>
        <p className="max-w-xs text-sm">
          Selecione um amigo ao lado para conversar e combinar uma partida.
        </p>
      </div>
    </div>
  );
}
