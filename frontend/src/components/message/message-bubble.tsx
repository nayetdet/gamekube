'use client';

import { CheckIcon, CheckCheckIcon } from 'lucide-react';
import type { Message } from '@/entities/message/message.entity';
import { formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';
import {
  LocalTimestamp,
  useLocalTimeZone,
} from '@/components/common/local-timestamp';

export function MessageBubble({
  message,
  own,
}: {
  message: Message;
  own: boolean;
}) {
  const read = message.status === 'READ';
  const timeZone = useLocalTimeZone();
  return (
    <li
      className={cn(
        'flex motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300',
        own ? 'justify-end' : 'justify-start',
      )}
    >
      <article
        className={cn(
          'max-w-[85%] space-y-1.5 rounded-2xl px-4 py-2.5 sm:max-w-[70%]',
          own
            ? 'rounded-br-md bg-primary text-primary-foreground'
            : 'rounded-bl-md bg-muted text-foreground',
        )}
      >
        <p className="sr-only">{own ? 'Você' : message.senderUsername}</p>
        <p className="text-sm wrap-anywhere whitespace-pre-wrap">
          {message.content}
        </p>
        <div className="flex items-center justify-end gap-1.5 text-[11px] opacity-75">
          <LocalTimestamp value={message.createdAt} />
          {own ? (
            <span
              className="inline-flex items-center gap-1"
              aria-label={read ? 'Mensagem lida' : 'Mensagem enviada'}
              title={
                read
                  ? `Lida em ${formatDateTime(message.readAt, timeZone)}`
                  : 'Enviada'
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
