import { MessageCircleIcon } from 'lucide-react';
import type { Message } from '@/entities/message/message.entity';
import { EmptyState } from '@/components/common/empty-state';
import { MessageBubble } from './message-bubble';

export function MessageHistory({
  messages,
  username,
}: {
  messages: Message[];
  username: string;
}) {
  if (messages.length === 0)
    return (
      <EmptyState
        icon={MessageCircleIcon}
        title="A conversa começa aqui"
        description="Envie uma mensagem para combinar o próximo jogo."
      />
    );
  return (
    <ol
      aria-label="Histórico da conversa"
      className="space-y-3 rounded-xl bg-card p-4 ring-1 ring-border sm:p-6"
    >
      {[...messages].reverse().map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          own={message.senderUsername === username}
        />
      ))}
    </ol>
  );
}
