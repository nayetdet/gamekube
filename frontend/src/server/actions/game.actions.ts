'use server';

import { redirect } from 'next/navigation';
import { z } from 'zod';
import { routes } from '@/config/routes';
import { gameCatalog, type GameSlug } from '@/entities/game/game.entity';
import { gameService } from '@/services/game.service';
import { requireSession } from '@/server/auth/dal';
import { attempt, failed, type ActionState } from './action-state';

const slugSchema = z.enum(
  gameCatalog.map((game) => game.slug) as [GameSlug, ...GameSlug[]],
);

export async function launchGameAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const slug = slugSchema.safeParse(formData.get('slug'));
  if (!slug.success) return failed('Esse jogo não está disponível.');

  return attempt(
    async (): Promise<ActionState> => {
      await requireSession();
      const session = await gameService.create(slug.data);
      redirect(routes.play(slug.data, session.url));
    },
    {
      500: 'O cluster não conseguiu iniciar a sessão. Tente novamente em instantes.',
      502: 'O cluster não respondeu a tempo.',
      504: 'A sessão não subiu antes do prazo. Nada ficou em execução.',
    },
  );
}
