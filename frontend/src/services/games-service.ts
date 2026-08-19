import { apiClient } from '@/lib/api-client';
import type { GameResponse } from '@/types/payload/response/game-response';

export const gamesService = {
  createCaveStory: () => apiClient.post<GameResponse>('/v1/games/cavestory'),
};
