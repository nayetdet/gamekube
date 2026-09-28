import 'server-only';
import type { Message } from '@/entities/message/message.entity';
import type { Page } from '@/entities/shared/page.entity';
import { apiJson, apiVoid } from './http/api-client';

const conversation = (username: string) =>
  `/v1/messages/${encodeURIComponent(username)}`;

export const messageService = {
  conversation(username: string, page = 0): Promise<Page<Message>> {
    return apiJson<Page<Message>>(conversation(username), {
      query: { page, size: 50 },
    });
  },
  send(username: string, content: string): Promise<Message> {
    return apiJson<Message>(conversation(username), {
      method: 'POST',
      body: { content },
    });
  },
  markAsRead(username: string): Promise<void> {
    return apiVoid(conversation(username), { method: 'PATCH' });
  },
  countUnread(): Promise<{ unreadCount: number }> {
    return apiJson<{ unreadCount: number }>('/v1/messages/unread/count');
  },
};
