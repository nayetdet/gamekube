import 'server-only';
import type { Friendship } from '@/entities/friendship/friendship.entity';
import type { FriendRequestInput } from '@/entities/friendship/friendship.schema';
import type { User } from '@/entities/user/user.entity';
import { apiJson, apiVoid } from './http/api-client';

const endpoint = {
  friends: '/v1/friends',
  requests: '/v1/friends/requests',
  received: '/v1/friends/requests/received',
  sent: '/v1/friends/requests/sent',
  accept: (id: string) => `/v1/friends/requests/${id}/accept`,
  reject: (id: string) => `/v1/friends/requests/${id}/reject`,
  item: (username: string) => `/v1/friends/${encodeURIComponent(username)}`,
};

export const friendshipService = {
  listFriends(): Promise<User[]> {
    return apiJson<User[]>(endpoint.friends);
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
      body: input,
    });
  },

  acceptRequest(id: string): Promise<Friendship> {
    return apiJson<Friendship>(endpoint.accept(id), { method: 'POST' });
  },

  rejectRequest(id: string): Promise<Friendship> {
    return apiJson<Friendship>(endpoint.reject(id), { method: 'POST' });
  },

  remove(username: string): Promise<void> {
    return apiVoid(endpoint.item(username), { method: 'DELETE' });
  },
};
