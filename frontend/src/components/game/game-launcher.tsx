'use client';

import { useActionState } from 'react';
import { PlayIcon } from 'lucide-react';
import { idleState } from '@/server/actions/action-state';
import { launchGameAction } from '@/server/actions/game.actions';
import { useActionToast } from '@/hooks/use-action-toast';
import { SubmitButton } from '@/components/common/submit-button';

export function GameLauncher({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(launchGameAction, idleState);
  useActionToast(state);

  return (
    <div className="space-y-3">
      <form action={action}>
        <input type="hidden" name="slug" value={slug} />
        <SubmitButton
          className="w-full font-bold sm:w-auto"
          pendingLabel="Provisionando sua sessão…"
        >
          <PlayIcon aria-hidden />
          Jogar agora
        </SubmitButton>
      </form>

      {pending ? (
        <p className="text-xs text-muted-foreground">
          Preparando seu jogo. Isso pode levar alguns minutos.
        </p>
      ) : null}
    </div>
  );
}
