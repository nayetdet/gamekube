'use server';

import { redirect } from 'next/navigation';
import { env } from '@/config/env';
import { routes } from '@/config/routes';
import { parseSessionUrl } from '@/entities/game/game.entity';
import { gameIdSchema } from '@/entities/game/game.schema';
import { gameService } from '@/services/game.service';
import { requireSession } from '@/server/auth/dal';
import { attempt, failed, type ActionState } from './action-state';

export async function launchGameAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const slug = gameIdSchema.safeParse(formData.get('slug'));
  if (!slug.success) return failed('Esse jogo não está disponível.');

  return attempt(
    async (): Promise<ActionState> => {
      await requireSession();
      if (!(await gameService.find(slug.data)))
        return failed('Esse jogo não está disponível.');
      const session = await gameService.create(slug.data);
      const url = parseSessionUrl(session.url, env().GAME_SESSION_DOMAIN);
      if (!url) return failed('A sessão retornou um endereço inválido.');
      redirect(routes.play(slug.data, url));
    },
    {
      409: 'Você já tem uma sessão ativa. Encerre-a antes de iniciar outra.',
      500: 'O cluster não conseguiu iniciar a sessão. Tente novamente em instantes.',
      502: 'O cluster não respondeu a tempo.',
      504: 'A sessão não subiu antes do prazo. Nada ficou em execução.',
    },
  );
}

export async function destroyGameAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = gameIdSchema.safeParse(formData.get('slug'));
  if (!id.success) return failed('Esse jogo não está disponível.');
  return attempt(async (): Promise<ActionState> => {
    await requireSession();
    await gameService.destroy(id.data);
    redirect(routes.games);
  });
}
