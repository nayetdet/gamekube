'use server';

import { refresh } from 'next/cache';
import { friendRequestSchema } from '@/entities/friendship/friendship.schema';
import { usernameParamSchema } from '@/entities/user/user.schema';
import { friendshipService } from '@/services/friendship.service';
import { requireSession } from '@/server/auth/dal';
import {
  attempt,
  failed,
  invalid,
  succeeded,
  type ActionState,
} from './action-state';

export async function sendFriendRequestAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = friendRequestSchema.safeParse({
    username: formData.get('username'),
  });
  if (!parsed.success) return invalid(parsed.error.issues);

  return attempt(
    async () => {
      await requireSession();
      await friendshipService.sendRequest(parsed.data);
      refresh();
      return succeeded(`Pedido enviado para ${parsed.data.username}.`);
    },
    {
      400: 'Você não pode enviar um pedido para si mesmo.',
      404: `Nenhum jogador está cadastrado como "${parsed.data.username}".`,
      409: 'Já existe um pedido ou amizade entre vocês dois.',
    },
  );
}

export async function respondToRequestAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const username = usernameParamSchema.safeParse(formData.get('username'));
  const decision = formData.get('decision');
  if (!username.success) return failed('Esse pedido não existe mais.');
  if (decision !== 'accept' && decision !== 'reject')
    return failed('Resposta inválida.');

  const accepting = decision === 'accept';
  return attempt(
    async () => {
      await requireSession();
      if (accepting) await friendshipService.acceptRequest(username.data);
      else await friendshipService.rejectRequest(username.data);
      refresh();
      return succeeded(
        accepting ? 'Vocês agora são amigos.' : 'Pedido recusado.',
      );
    },
    {
      400: 'Esse pedido já foi respondido.',
      403: 'Apenas o destinatário pode responder a este pedido.',
      404: 'Esse pedido não existe mais.',
    },
  );
}

export async function removeFriendAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const username = usernameParamSchema.safeParse(formData.get('username'));
  if (!username.success) return failed('Jogador desconhecido.');

  return attempt(
    async () => {
      await requireSession();
      await friendshipService.remove(username.data);
      refresh();
      return succeeded(`${username.data} foi removido dos seus amigos.`);
    },
    { 404: 'Você não é amigo desse jogador.' },
  );
}
