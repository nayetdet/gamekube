'use client';

import { useActionState } from 'react';
import type { PresenceStatus } from '@/entities/presence/presence.entity';
import { updatePresenceAction } from '@/server/actions/presence.actions';
import { idleState } from '@/server/actions/action-state';
import { useActionToast } from '@/hooks/use-action-toast';
import { SubmitButton } from '@/components/common/submit-button';
import { PresenceDot } from './presence-dot';

type PresenceQuickToggleProps = {
  status: PresenceStatus;
  currentGame: string | null;
};

export function PresenceQuickToggle({
  status,
  currentGame,
}: PresenceQuickToggleProps) {
  const [state, action] = useActionState(updatePresenceAction, idleState);
  useActionToast(state);

  const next: PresenceStatus = status === 'ONLINE' ? 'OFFLINE' : 'ONLINE';

  return (
    <form action={action}>
      <input type="hidden" name="status" value={next} />
      {next === 'ONLINE' && currentGame ? (
        <input type="hidden" name="currentGame" value={currentGame} />
      ) : null}
      <SubmitButton
        variant="outline"
        size="sm"
        pendingLabel="Atualizando…"
        className="rounded-full font-semibold"
      >
        <PresenceDot status={status} />
        {status === 'ONLINE' ? 'Ficar offline' : 'Ficar online'}
      </SubmitButton>
    </form>
  );
}
