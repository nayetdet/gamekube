import 'server-only';
import type { Session } from '@/server/auth/session.types';
import {
  messageNotificationSchema,
  readNotificationSchema,
} from '@/entities/message/message.schema';
import { createStompClient } from './stomp-client';

export function createEventStream(
  session: Session,
  signal: AbortSignal,
  gameId?: string,
) {
  const encoder = new TextEncoder();
  const client = createStompClient(session.accessToken);
  let dispose: (closeStream?: boolean) => void = () => {};
  return new ReadableStream<Uint8Array>({
    start(controller) {
      let closed = false;
      const emit = (event: string, data: unknown) => {
        if (!closed)
          controller.enqueue(
            encoder.encode(
              `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
            ),
          );
      };
      const heartbeat = () => {
        if (client.connected) {
          client.publish({ destination: '/app/user.heartbeat', body: '{}' });
          if (gameId)
            client.publish({
              destination: '/app/game.heartbeat',
              body: JSON.stringify({ gameId }),
            });
        }
        if (!closed) controller.enqueue(encoder.encode(': keepalive\n\n'));
      };
      const interval = setInterval(heartbeat, 10_000);
      const lifetime = setTimeout(
        () => dispose(),
        Math.max(
          1000,
          Math.min(240_000, session.expiresAt - Date.now() - 60_000),
        ),
      );
      const onAbort = () => dispose();
      dispose = (closeStream = true) => {
        if (closed) return;
        closed = true;
        clearInterval(interval);
        clearTimeout(lifetime);
        signal.removeEventListener('abort', onAbort);
        void client.deactivate({ force: true });
        if (closeStream) controller.close();
      };
      client.onConnect = () => {
        client.subscribe('/user/queue/messages', (message) => {
          try {
            const parsed = messageNotificationSchema.safeParse(
              JSON.parse(message.body),
            );
            if (parsed.success) emit('message', parsed.data);
          } catch {
            /* Ignore malformed notifications; REST remains authoritative. */
          }
        });
        client.subscribe('/user/queue/messages/read', (message) => {
          try {
            const parsed = readNotificationSchema.safeParse(
              JSON.parse(message.body),
            );
            if (parsed.success) emit('read', parsed.data);
          } catch {
            /* Ignore malformed notifications. */
          }
        });
        heartbeat();
        emit('connected', {});
      };
      client.onWebSocketClose = () => emit('disconnected', {});
      client.onStompError = () => dispose();
      signal.addEventListener('abort', onAbort, { once: true });
      if (signal.aborted) dispose();
      else client.activate();
    },
    cancel() {
      dispose(false);
    },
  });
}
