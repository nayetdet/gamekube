import 'server-only';
import type { Friendship } from '@/entities/friendship/friendship.entity';
import type { FriendRequestInput } from '@/entities/friendship/friendship.schema';
import type { User } from '@/entities/user/user.entity';
import type { Page } from '@/entities/shared/page.entity';
import { apiJson, apiVoid } from './http/api-client';

const endpoint = {
  friends: '/v1/friendships',
  requests: '/v1/friendships',
  received: '/v1/friendships/requests/received',
  sent: '/v1/friendships/requests/sent',
  accept: (username: string) =>
    `/v1/friendships/${encodeURIComponent(username)}/accept`,
  reject: (username: string) =>
    `/v1/friendships/${encodeURIComponent(username)}/reject`,
  item: (username: string) => `/v1/friendships/${encodeURIComponent(username)}`,
};

export const friendshipService = {
  listFriendsPage(page = 0, size = 8): Promise<Page<User>> {
    return apiJson<Page<User>>(endpoint.friends, { query: { page, size } });
  },

  async listFriends(): Promise<User[]> {
    const first = await this.listFriendsPage(0, 100);
    const pages = Math.ceil(first.pageable.total / first.pageable.pageSize);
    const rest = await Promise.all(
      Array.from({ length: Math.max(0, pages - 1) }, (_, index) =>
        this.listFriendsPage(index + 1, 100),
      ),
    );
    return [first, ...rest].flatMap((page) => page.content);
  },

  listReceivedRequests(): Promise<Friendship[]> {
    return apiJson<Friendship[]>(endpoint.received);
  },

  listSentRequests(): Promise<Friendship[]> {
    return apiJson<Friendship[]>(endpoint.sent);
  },

  sendRequest(input: FriendRequestInput): Promise<Friendship> {
    return apiJson<Friendship>(endpoint.requests, {
      method: 'POST',
      body: { addresseeUsername: input.username },
    });
  },

  acceptRequest(username: string): Promise<Friendship> {
    return apiJson<Friendship>(endpoint.accept(username), { method: 'PATCH' });
  },

  rejectRequest(username: string): Promise<Friendship> {
    return apiJson<Friendship>(endpoint.reject(username), { method: 'PATCH' });
  },

  remove(username: string): Promise<void> {
    return apiVoid(endpoint.item(username), { method: 'DELETE' });
  },
};
