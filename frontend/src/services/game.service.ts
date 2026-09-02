import 'server-only';
import type { GameSession, GameSlug } from '@/entities/game/game.entity';
import { apiJson } from './http/api-client';

const endpoint: Record<GameSlug, string> = {
  cavestory: '/v1/games/cavestory',
};

const LAUNCH_TIMEOUT_MS = 150_000;

export const gameService = {
  create(slug: GameSlug): Promise<GameSession> {
    return apiJson<GameSession>(endpoint[slug], {
      method: 'POST',
      timeoutMs: LAUNCH_TIMEOUT_MS,
    });
  },
};
