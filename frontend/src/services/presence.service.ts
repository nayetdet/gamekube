import 'server-only';
import type { Presence } from '@/entities/presence/presence.entity';
import type { PresenceUpdateInput } from '@/entities/presence/presence.schema';
import { apiJson } from './http/api-client';

const endpoint = {
  self: '/v1/users/me/presence',
  item: (username: string) =>
    `/v1/users/${encodeURIComponent(username)}/presence`,
};

export const presenceService = {
  updateSelf(input: PresenceUpdateInput): Promise<Presence> {
    return apiJson<Presence>(endpoint.self, { method: 'PUT', body: input });
  },

  findByUsername(username: string): Promise<Presence> {
    return apiJson<Presence>(endpoint.item(username));
  },
};
