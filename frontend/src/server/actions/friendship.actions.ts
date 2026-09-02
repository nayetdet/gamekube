'use server';

import { refresh } from 'next/cache';
import {
  friendRequestSchema,
  friendshipIdSchema,
} from '@/entities/friendship/friendship.schema';
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
  const id = friendshipIdSchema.safeParse(formData.get('id'));
  const decision = formData.get('decision');
  if (!id.success) return failed('Esse pedido não existe mais.');

  const accepting = decision === 'accept';
  return attempt(
    async () => {
      await requireSession();
      if (accepting) await friendshipService.acceptRequest(id.data);
      else await friendshipService.rejectRequest(id.data);
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
