'use client';

import { useActionState } from 'react';
import { SquareIcon } from 'lucide-react';
import { idleState } from '@/server/actions/action-state';
import { destroyGameAction } from '@/server/actions/game.actions';
import { FormAlert } from '@/components/common/form-alert';
import { SubmitButton } from '@/components/common/submit-button';

export function EndGameForm({ id }: { id: string }) {
  const [state, action] = useActionState(destroyGameAction, idleState);
  return (
    <div className="space-y-2">
      <form action={action}>
        <input type="hidden" name="slug" value={id} />
        <SubmitButton
          variant="destructive"
          size="sm"
          pendingLabel="Encerrando…"
        >
          <SquareIcon aria-hidden /> Encerrar sessão
        </SubmitButton>
      </form>
      <FormAlert state={state} />
    </div>
  );
}
