import 'server-only';
import type { Page } from '@/entities/shared/page.entity';
import type { User } from '@/entities/user/user.entity';
import type { UserQuery } from '@/entities/user/user.query';
import type { UserUpdateInput } from '@/entities/user/user.schema';
import { apiJson, apiVoid } from './http/api-client';

const endpoint = {
  collection: '/v1/users',
  self: '/v1/users/me',
  item: (username: string) => `/v1/users/${encodeURIComponent(username)}`,
  emailReset: (username: string) =>
    `/v1/users/${encodeURIComponent(username)}/reset-email`,
};

export const userService = {
  search(query: UserQuery): Promise<Page<User>> {
    return apiJson<Page<User>>(endpoint.collection, { query });
  },

  findByUsername(username: string): Promise<User> {
    return apiJson<User>(endpoint.item(username));
  },

  findSelf(): Promise<User> {
    return apiJson<User>(endpoint.self);
  },

  requestEmailReset(username: string): Promise<void> {
    return apiVoid(endpoint.emailReset(username), { method: 'POST' });
  },

  update(username: string, input: UserUpdateInput): Promise<void> {
    return apiVoid(endpoint.item(username), { method: 'PUT', body: input });
  },

  remove(username: string): Promise<void> {
    return apiVoid(endpoint.item(username), { method: 'DELETE' });
  },
};
