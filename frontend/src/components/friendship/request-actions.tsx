'use client';

import { useActionState } from 'react';
import { CheckIcon, XIcon } from 'lucide-react';
import { idleState } from '@/server/actions/action-state';
import { respondToRequestAction } from '@/server/actions/friendship.actions';
import { useActionToast } from '@/hooks/use-action-toast';
import { SubmitButton } from '@/components/common/submit-button';

export function RequestActions({ id }: { id: string }) {
  const [state, action] = useActionState(respondToRequestAction, idleState);
  useActionToast(state);

  return (
    <form action={action} className="flex shrink-0 items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <SubmitButton
        name="decision"
        value="reject"
        variant="outline"
        size="sm"
        aria-label="Recusar pedido"
      >
        <XIcon aria-hidden />
        Recusar
      </SubmitButton>
      <SubmitButton
        name="decision"
        value="accept"
        size="sm"
        aria-label="Aceitar pedido"
      >
        <CheckIcon aria-hidden />
        Aceitar
      </SubmitButton>
    </form>
  );
}
