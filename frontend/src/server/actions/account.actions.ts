'use server';

import { redirect } from 'next/navigation';
import { routes } from '@/config/routes';
import { usernameParamSchema } from '@/entities/user/user.schema';
import { userService } from '@/services/user.service';
import { requireSession } from '@/server/auth/dal';
import { attempt, failed, type ActionState } from './action-state';

export async function deleteAccountAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const username = usernameParamSchema.safeParse(formData.get('username'));
  const confirmation = String(formData.get('confirmation') ?? '').trim();

  if (!username.success) return failed('Jogador desconhecido.');
  if (confirmation !== username.data) {
    return failed('Digite seu nome de usuário exatamente para confirmar.');
  }

  return attempt(
    async () => {
      const session = await requireSession();
      await userService.remove(username.data);
      if (session.user.username === username.data) {
        return redirect(routes.authLogout);
      }
      return redirect(routes.users);
    },
    {
      403: 'Você só pode excluir sua própria conta.',
      404: 'Essa conta não existe mais.',
    },
  );
}
