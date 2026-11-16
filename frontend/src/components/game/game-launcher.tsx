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
          className="h-11 w-full justify-center gap-2 border-white/20 bg-[#6424b5] px-4 text-sm font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_14px_rgba(80,28,150,0.2)] backdrop-blur-sm hover:bg-[#762fce] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.3),0_6px_18px_rgba(80,28,150,0.3)]"
          pendingLabel="Provisionando sua sessão…"
        >
          <PlayIcon className="size-4 fill-current" aria-hidden />
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
