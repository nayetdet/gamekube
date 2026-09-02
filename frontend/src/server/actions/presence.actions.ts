'use server';

import { refresh } from 'next/cache';
import { presenceUpdateSchema } from '@/entities/presence/presence.schema';
import { presenceService } from '@/services/presence.service';
import { requireSession } from '@/server/auth/dal';
import { attempt, invalid, succeeded, type ActionState } from './action-state';

export async function updatePresenceAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = presenceUpdateSchema.safeParse({
    status: formData.get('status'),
    currentGame: formData.get('currentGame') ?? undefined,
  });
  if (!parsed.success) return invalid(parsed.error.issues);

  return attempt(async () => {
    await requireSession();
    const presence = await presenceService.updateSelf(parsed.data);
    refresh();
    return succeeded(
      presence.status === 'ONLINE'
        ? `Você está online${presence.currentGame ? ` · ${presence.currentGame}` : ''}.`
        : 'Agora você está invisível para seus amigos.',
    );
  });
}
