import 'server-only';
import { cache } from 'react';
import type { GameDefinition, GameSession } from '@/entities/game/game.entity';
import { apiJson, apiVoid } from './http/api-client';

const list = cache(() => apiJson<GameDefinition[]>('/v1/games'));
const instance = (id: string) => `/v1/games/${encodeURIComponent(id)}/instance`;

const LAUNCH_TIMEOUT_MS = 330_000;

export const gameService = {
  list,
  async find(id: string): Promise<GameDefinition | undefined> {
    return (await list()).find((game) => game.id === id);
  },
  create(id: string): Promise<GameSession> {
    return apiJson<GameSession>(instance(id), {
      method: 'POST',
      timeoutMs: LAUNCH_TIMEOUT_MS,
    });
  },
  destroy(id: string): Promise<void> {
    return apiVoid(instance(id), { method: 'DELETE' });
  },
};
