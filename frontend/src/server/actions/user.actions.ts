'use server';

import { refresh } from 'next/cache';
import {
  userUpdateSchema,
  usernameParamSchema,
} from '@/entities/user/user.schema';
import { userService } from '@/services/user.service';
import { requireSession } from '@/server/auth/dal';
import {
  attempt,
  failed,
  invalid,
  succeeded,
  type ActionState,
} from './action-state';

export async function updateUserAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const current = usernameParamSchema.safeParse(
    formData.get('currentUsername'),
  );
  if (!current.success) return failed('Jogador desconhecido.');

  const parsed = userUpdateSchema.safeParse({
    username: formData.get('username'),
    name: formData.get('name'),
    description: formData.get('description'),
  });
  if (!parsed.success) return invalid(parsed.error.issues);

  return attempt(
    async () => {
      await requireSession();
      await userService.update(current.data, parsed.data);
      refresh();
      return succeeded('Perfil salvo.');
    },
    {
      403: 'Você só pode editar seu próprio perfil.',
      404: 'Esse jogador não existe mais.',
      409: 'Esse nome de usuário já está em uso.',
    },
  );
}

export async function requestEmailResetAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const username = usernameParamSchema.safeParse(formData.get('username'));
  if (!username.success) return failed('Jogador desconhecido.');

  return attempt(
    async () => {
      await requireSession();
      await userService.requestEmailReset(username.data);
      return succeeded(
        'Verifique sua caixa de entrada pelo link de confirmação.',
      );
    },
    {
      403: 'Você só pode alterar seu próprio endereço de e-mail.',
      502: 'O provedor de identidade não conseguiu enviar o e-mail.',
    },
  );
}
