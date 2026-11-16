import 'server-only';
import { cache } from 'react';
import type { GameDefinition, GameSession } from '@/entities/game/game.entity';
import { hasStatus } from './http/api-error';
import { apiJson, apiVoid } from './http/api-client';

const list = cache(() => apiJson<GameDefinition[]>('/v1/games'));
const instance = (id: string) => `/v1/games/${encodeURIComponent(id)}/instance`;

const LAUNCH_TIMEOUT_MS = 330_000;

export const gameService = {
  list,
  friendsWhoPlayed(id: string): Promise<string[]> {
    return apiJson<string[]>(`/v1/games/${encodeURIComponent(id)}/friends`);
  },
  playedBy(
    username: string,
  ): Promise<{ gameId: string; lastPlayedAt: string }[]> {
    return apiJson(`/v1/users/${encodeURIComponent(username)}/games`);
  },
  find: cache(async (id: string): Promise<GameDefinition | undefined> => {
    try {
      return await apiJson<GameDefinition>(
        `/v1/games/${encodeURIComponent(id)}`,
      );
    } catch (error) {
      if (hasStatus(error, 404)) return undefined;
      throw error;
    }
  }),
  create(id: string): Promise<GameSession> {
    return apiJson<GameSession>(instance(id), {
      method: 'POST',
      timeoutMs: LAUNCH_TIMEOUT_MS,
    });
  },
  destroy(id: string): Promise<void> {
    return apiVoid(instance(id), {
      method: 'DELETE',
      timeoutMs: LAUNCH_TIMEOUT_MS,
    });
  },
};
