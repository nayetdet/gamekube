import { CheckIcon, CheckCheckIcon } from 'lucide-react';
import type { Message } from '@/entities/message/message.entity';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';

export function MessageBubble({
  message,
  own,
}: {
  message: Message;
  own: boolean;
}) {
  const read = message.status === 'READ';
  return (
    <li className={cn('flex', own ? 'justify-end' : 'justify-start')}>
      <article
        className={cn(
          'max-w-[85%] space-y-2 rounded-2xl px-4 py-3 sm:max-w-[70%]',
          own ? 'bg-primary text-primary-foreground' : 'bg-muted',
        )}
      >
        <p className="sr-only">{own ? 'Você' : message.senderUsername}</p>
        <p className="text-sm wrap-anywhere whitespace-pre-wrap">
          {message.content}
        </p>
        <div className="flex items-center justify-end gap-2 text-xs opacity-75">
          <time
            dateTime={`${message.createdAt}${message.createdAt.endsWith('Z') ? '' : 'Z'}`}
          >
            {formatDateTime(message.createdAt)}
          </time>
          {own ? (
            <span
              className="inline-flex items-center gap-1"
              title={
                read ? `Lida em ${formatDateTime(message.readAt)}` : 'Enviada'
              }
            >
              {read ? (
                <CheckCheckIcon className="size-3.5" aria-hidden />
              ) : (
                <CheckIcon className="size-3.5" aria-hidden />
              )}
              <span className="sr-only">{read ? 'Lida' : 'Enviada'}</span>
            </span>
          ) : null}
        </div>
      </article>
    </li>
  );
}
