'use server';

import { refresh } from 'next/cache';
import { messageRequestSchema } from '@/entities/message/message.schema';
import { usernameParamSchema } from '@/entities/user/user.schema';
import { messageService } from '@/services/message.service';
import { requireSession } from '@/server/auth/dal';
import {
  attempt,
  failed,
  invalid,
  succeeded,
  type ActionState,
} from './action-state';

export async function sendMessageAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = messageRequestSchema.safeParse({
    username: formData.get('username'),
    content: formData.get('content'),
  });
  if (!parsed.success) return invalid(parsed.error.issues);
  return attempt(
    async () => {
      await requireSession();
      await messageService.send(parsed.data.username, parsed.data.content);
      refresh();
      return succeeded('Mensagem enviada.');
    },
    {
      403: 'Adicione esse jogador como amigo para conversar.',
      404: 'Esse jogador não existe mais.',
      503: 'O serviço de mensagens está indisponível. Tente novamente em instantes.',
    },
  );
}

export async function markConversationReadAction(
  username: string,
): Promise<ActionState> {
  const parsed = usernameParamSchema.safeParse(username);
  if (!parsed.success) return failed('Conversa desconhecida.');
  return attempt(async () => {
    await requireSession();
    await messageService.markAsRead(parsed.data);
    refresh();
    return succeeded('Mensagens marcadas como lidas.');
  });
}
